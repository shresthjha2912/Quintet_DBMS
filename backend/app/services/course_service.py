from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.course import Course
from app.schemas.course import CourseCreate


def create_course(db: Session, course_data: CourseCreate) -> Course:
    """Create a new course (called by admin)."""
    # TODO: add your query logic here
    pass


def get_all_courses(db: Session) -> list[Course]:
    """Get all courses."""
    # TODO: add your query logic here
    pass


def get_course_by_id(db: Session, course_id: int) -> Course:
    """Get a single course by ID."""
    # TODO: add your query logic here
    pass


def delete_course(db: Session, course_id: int) -> None:
    """Delete a course (called by admin)."""
    # TODO: add your query logic here
    pass


def assign_instructor(db: Session, course_id: int, instructor_id: int) -> Course:
    """Assign an instructor to a course (called by admin)."""
    # TODO: add your query logic here
    pass
