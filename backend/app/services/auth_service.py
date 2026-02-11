from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.models.student import Student
from app.models.instructor import Instructor
from app.schemas.user import StudentSignup, AdminCreateInstructor
from app.core.security import hash_password, verify_password, create_access_token


def register_student(db: Session, data: StudentSignup) -> dict:
    existing = db.query(User).filter(User.email_id == data.email_id).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    new_user = User(
        email_id=data.email_id,
        password=hash_password(data.password),
        role="student",
    )
    db.add(new_user)
    db.flush()

    new_student = Student(
        user_id=new_user.user_id,
        age=data.age,
        skill_level=data.skill_level,
        category=data.category,
        country=data.country,
    )
    db.add(new_student)
    db.commit()
    db.refresh(new_user)
    db.refresh(new_student)

    access_token = create_access_token(
        data={"sub": new_user.email_id, "role": new_user.role, "user_id": new_user.user_id}
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": new_user.role,
        "user_id": new_user.user_id,
    }


def login_user(db: Session, email_id: str, password: str, expected_role: str) -> dict:
    user = db.query(User).filter(User.email_id == email_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not verify_password(password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if user.role != expected_role:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"This account is not registered as {expected_role}",
        )

    access_token = create_access_token(
        data={"sub": user.email_id, "role": user.role, "user_id": user.user_id}
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "user_id": user.user_id,
    }


def create_instructor(db: Session, data: AdminCreateInstructor) -> Instructor:
    existing = db.query(User).filter(User.email_id == data.email_id).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    new_user = User(
        email_id=data.email_id,
        password=hash_password(data.password),
        role="instructor",
    )
    db.add(new_user)
    db.flush()

    new_instructor = Instructor(
        user_id=new_user.user_id,
        name=data.name,
        expertise=data.expertise,
    )
    db.add(new_instructor)
    db.commit()
    db.refresh(new_instructor)
    return new_instructor


def get_student_profile(db: Session, user_id: int) -> dict:
    student = db.query(Student).filter(Student.user_id == user_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found",
        )
    return {
        "student_id": student.student_id,
        "user_id": student.user_id,
        "email_id": student.user.email_id,
        "age": student.age,
        "skill_level": student.skill_level,
        "category": student.category,
        "country": student.country,
    }


def get_instructor_profile(db: Session, user_id: int) -> dict:
    instructor = db.query(Instructor).filter(Instructor.user_id == user_id).first()
    if not instructor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Instructor profile not found",
        )
    return {
        "instructor_id": instructor.instructor_id,
        "user_id": instructor.user_id,
        "email_id": instructor.user.email_id,
        "name": instructor.name,
        "expertise": instructor.expertise,
    }


def get_all_students(db: Session) -> list[dict]:
    students = db.query(Student).all()
    return [
        {
            "student_id": s.student_id,
            "user_id": s.user_id,
            "email_id": s.user.email_id,
            "age": s.age,
            "skill_level": s.skill_level,
            "category": s.category,
            "country": s.country,
        }
        for s in students
    ]


def get_all_instructors(db: Session) -> list[dict]:
    instructors = db.query(Instructor).all()
    return [
        {
            "instructor_id": i.instructor_id,
            "user_id": i.user_id,
            "email_id": i.user.email_id,
            "name": i.name,
            "expertise": i.expertise,
        }
        for i in instructors
    ]


def get_student_by_id(db: Session, student_id: int) -> dict:
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
    from app.models.enrollment import Enrollment
    enrollments = db.query(Enrollment).filter(Enrollment.student_id == student_id).all()
    return {
        "student_id": student.student_id,
        "user_id": student.user_id,
        "email_id": student.user.email_id,
        "age": student.age,
        "skill_level": student.skill_level,
        "category": student.category,
        "country": student.country,
        "enrollments": [
            {
                "course_id": e.course_id,
                "course_name": e.course.course_name if e.course else None,
                "evaluation_score": e.evaluation_score,
            }
            for e in enrollments
        ],
    }


def get_instructor_by_id(db: Session, instructor_id: int) -> dict:
    instructor = db.query(Instructor).filter(Instructor.instructor_id == instructor_id).first()
    if not instructor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Instructor not found")
    from app.models.course import Course
    courses = db.query(Course).filter(Course.instructor_id == instructor_id).all()
    return {
        "instructor_id": instructor.instructor_id,
        "user_id": instructor.user_id,
        "email_id": instructor.user.email_id,
        "name": instructor.name,
        "expertise": instructor.expertise,
        "courses": [
            {
                "course_id": c.course_id,
                "course_name": c.course_name,
                "duration": c.duration,
                "program_type": c.program_type,
            }
            for c in courses
        ],
    }


def remove_student(db: Session, student_id: int) -> None:
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found",
        )
    user = db.query(User).filter(User.user_id == student.user_id).first()

    from app.models.enrollment import Enrollment
    db.query(Enrollment).filter(Enrollment.student_id == student_id).delete()

    db.delete(student)
    if user:
        db.delete(user)
    db.commit()


def remove_instructor(db: Session, instructor_id: int) -> None:
    instructor = db.query(Instructor).filter(Instructor.instructor_id == instructor_id).first()
    if not instructor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Instructor not found")
    user = db.query(User).filter(User.user_id == instructor.user_id).first()

    from app.models.course import Course
    db.query(Course).filter(Course.instructor_id == instructor_id).update({Course.instructor_id: None})

    db.delete(instructor)
    if user:
        db.delete(user)
    db.commit()
