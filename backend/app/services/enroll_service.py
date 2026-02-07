from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.enrollment import Enrollment
from app.schemas.enrollment import EnrollmentCreate


def enroll_student(db: Session, enrollment_data: EnrollmentCreate) -> Enrollment:
    # Check if already enrolled
    existing = (
        db.query(Enrollment)
        .filter(
            Enrollment.student_id == enrollment_data.student_id,
            Enrollment.course_id == enrollment_data.course_id,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Student is already enrolled in this course",
        )

    new_enrollment = Enrollment(
        student_id=enrollment_data.student_id,
        course_id=enrollment_data.course_id,
    )
    db.add(new_enrollment)
    db.commit()
    db.refresh(new_enrollment)
    return new_enrollment


def get_enrollments_by_student(db: Session, student_id: int) -> list[Enrollment]:
    return db.query(Enrollment).filter(Enrollment.student_id == student_id).all()


def get_enrollments_by_course(db: Session, course_id: int) -> list[Enrollment]:
    return db.query(Enrollment).filter(Enrollment.course_id == course_id).all()
