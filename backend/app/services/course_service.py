from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.course import Course
from app.models.instructor import Instructor
from app.models.university import University
from app.schemas.course import CourseCreate


def create_course(db: Session, course_data: CourseCreate) -> Course:
    instructor = db.query(Instructor).filter(
        Instructor.instructor_id == course_data.instructor_id
    ).first()
    if not instructor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Instructor not found",
        )

    university = db.query(University).filter(
        University.university_id == course_data.university_id
    ).first()
    if not university:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="University not found",
        )

    new_course = Course(
        course_name=course_data.course_name,
        duration=course_data.duration,
        program_type=course_data.program_type,
        instructor_id=course_data.instructor_id,
        university_id=course_data.university_id,
    )
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return new_course


def get_all_courses(db: Session) -> list[Course]:
    return db.query(Course).all()


def get_course_by_id(db: Session, course_id: int) -> Course:
    course = db.query(Course).filter(Course.course_id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found",
        )
    return course


def get_courses_by_instructor(db: Session, instructor_id: int) -> list[Course]:
    return db.query(Course).filter(Course.instructor_id == instructor_id).all()


def delete_course(db: Session, course_id: int) -> None:
    course = db.query(Course).filter(Course.course_id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found",
        )

    from app.models.enrollment import Enrollment
    from app.models.content import Content
    from app.models.course_topic import CourseTopic
    from app.models.textbook_used import TextbookUsed

    db.query(Enrollment).filter(Enrollment.course_id == course_id).delete()
    db.query(Content).filter(Content.course_id == course_id).delete()
    db.query(CourseTopic).filter(CourseTopic.course_id == course_id).delete()
    db.query(TextbookUsed).filter(TextbookUsed.course_id == course_id).delete()

    db.delete(course)
    db.commit()


def assign_instructor(db: Session, course_id: int, instructor_id: int) -> Course:
    course = db.query(Course).filter(Course.course_id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found",
        )

    instructor = db.query(Instructor).filter(
        Instructor.instructor_id == instructor_id
    ).first()
    if not instructor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Instructor not found",
        )

    course.instructor_id = instructor_id
    db.commit()
    db.refresh(course)
    return course


def get_course_detail(db: Session, course_id: int) -> dict:
    course = db.query(Course).filter(Course.course_id == course_id).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")

    from app.models.enrollment import Enrollment
    enrollments = (
        db.query(Enrollment).filter(Enrollment.course_id == course_id).all()
    )

    return {
        "course_id": course.course_id,
        "course_name": course.course_name,
        "duration": course.duration,
        "program_type": course.program_type,
        "instructor_id": course.instructor_id,
        "instructor_name": course.instructor.name if course.instructor else "Unassigned",
        "instructor_email": course.instructor.user.email_id if course.instructor and course.instructor.user else None,
        "university_id": course.university_id,
        "university_name": course.university.name if course.university else "Unknown",
        "enrolled_students": [
            {
                "student_id": e.student_id,
                "student_email": e.student.user.email_id if e.student and e.student.user else None,
                "evaluation_score": e.evaluation_score,
            }
            for e in enrollments
        ],
    }
