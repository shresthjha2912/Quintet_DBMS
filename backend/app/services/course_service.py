from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.course import Course
from app.schemas.course import CourseCreate


def create_course(db: Session, course_data: CourseCreate) -> Course:
    existing = db.query(Course).filter(Course.code == course_data.code).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Course code already exists",
        )

    new_course = Course(
        title=course_data.title,
        description=course_data.description,
        code=course_data.code,
        instructor_id=course_data.instructor_id,
    )
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return new_course


def get_all_courses(db: Session) -> list[Course]:
    return db.query(Course).all()


def get_course_by_id(db: Session, course_id: int) -> Course:
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found",
        )
    return course
