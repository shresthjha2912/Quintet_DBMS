from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.course import Course
from app.models.instructor import Instructor
from app.models.university import University
from app.schemas.course import CourseCreate


def create_course(db: Session, course_data: CourseCreate) -> Course:
    """Create a new course (called by admin)."""
    # Verify instructor exists
    instructor = db.query(Instructor).filter(
        Instructor.instructor_id == course_data.instructor_id
    ).first()
    if not instructor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Instructor not found",
        )

    # Verify university exists
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
    """Get all courses."""
    return db.query(Course).all()


def get_course_by_id(db: Session, course_id: int) -> Course:
    """Get a single course by ID."""
    course = db.query(Course).filter(Course.course_id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found",
        )
    return course


def get_courses_by_instructor(db: Session, instructor_id: int) -> list[Course]:
    """Get all courses assigned to a specific instructor."""
    return db.query(Course).filter(Course.instructor_id == instructor_id).all()


def delete_course(db: Session, course_id: int) -> None:
    """Delete a course (called by admin). Also removes related enrollments & content."""
    course = db.query(Course).filter(Course.course_id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found",
        )

    # Delete related records first (FK constraints)
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
    """Assign an instructor to a course (called by admin)."""
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
