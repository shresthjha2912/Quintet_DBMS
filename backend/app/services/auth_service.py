from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.models.student import Student
from app.models.instructor import Instructor
from app.schemas.user import StudentSignup, AdminCreateInstructor
from app.core.security import hash_password, verify_password, create_access_token


# ==================== STUDENT SIGNUP ====================

def register_student(db: Session, data: StudentSignup) -> dict:
    """
    Student signup flow:
    1. Check if email already exists
    2. Create a User row (role=student)
    3. Create a Student row linked to that User
    4. Return a JWT token
    """
    existing = db.query(User).filter(User.email_id == data.email_id).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # 1. Create user
    new_user = User(
        email_id=data.email_id,
        password=hash_password(data.password),
        role="student",
    )
    db.add(new_user)
    db.flush()  # flush to get user_id before creating student

    # 2. Create student profile
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

    # 3. Return JWT
    access_token = create_access_token(
        data={"sub": new_user.email_id, "role": new_user.role, "user_id": new_user.user_id}
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": new_user.role,
        "user_id": new_user.user_id,
    }


# ==================== GENERIC LOGIN ====================

def login_user(db: Session, email_id: str, password: str, expected_role: str) -> dict:
    """
    Generic login for all roles.
    Verifies email + password + role match, then returns JWT.
    """
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


# ==================== ADMIN: CREATE INSTRUCTOR ====================

def create_instructor(db: Session, data: AdminCreateInstructor) -> Instructor:
    """
    Admin creates an instructor:
    1. Create a User row (role=instructor)
    2. Create an Instructor row linked to that User
    """
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


# ==================== PROFILE FETCHERS ====================

def get_student_profile(db: Session, user_id: int) -> dict:
    """Fetch student profile by user_id (from JWT)."""
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
    """Fetch instructor profile by user_id (from JWT)."""
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


# ==================== ADMIN: LIST / REMOVE ====================

def get_all_students(db: Session) -> list[dict]:
    """Admin fetches all students with their user info."""
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
    """Admin fetches all instructors with their user info."""
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


def remove_student(db: Session, student_id: int) -> None:
    """Admin removes a student and their associated user account."""
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found",
        )
    user = db.query(User).filter(User.user_id == student.user_id).first()

    # Delete enrollments first (FK constraint)
    from app.models.enrollment import Enrollment
    db.query(Enrollment).filter(Enrollment.student_id == student_id).delete()

    db.delete(student)
    if user:
        db.delete(user)
    db.commit()
