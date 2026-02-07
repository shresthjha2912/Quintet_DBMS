from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.enrollment import Enrollment
from app.schemas.enrollment import EnrollmentCreate


def enroll_student(db: Session, enrollment_data: EnrollmentCreate) -> Enrollment:
    """Enroll a student in a course."""
    # TODO: add your query logic here
    pass


def drop_student(db: Session, student_id: int, course_id: int) -> None:
    """Drop a student from a course."""
    # TODO: add your query logic here
    pass


def get_enrollments_by_student(db: Session, student_id: int) -> list[Enrollment]:
    """Get all enrollments for a given student."""
    # TODO: add your query logic here
    pass


def get_enrollments_by_course(db: Session, course_id: int) -> list[Enrollment]:
    """Get all enrollments for a given course."""
    # TODO: add your query logic here
    pass
