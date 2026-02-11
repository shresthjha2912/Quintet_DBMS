from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.enrollment import Enrollment
from app.models.student import Student
from app.models.course import Course
from app.schemas.enrollment import EnrollmentCreate


def enroll_student(db: Session, enrollment_data: EnrollmentCreate) -> Enrollment:
    student = db.query(Student).filter(
        Student.student_id == enrollment_data.student_id
    ).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found",
        )

    course = db.query(Course).filter(
        Course.course_id == enrollment_data.course_id
    ).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found",
        )

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
        evaluation_score=0.0,
    )
    db.add(new_enrollment)
    db.commit()
    db.refresh(new_enrollment)
    return new_enrollment


def drop_student(db: Session, student_id: int, course_id: int) -> None:
    enrollment = (
        db.query(Enrollment)
        .filter(
            Enrollment.student_id == student_id,
            Enrollment.course_id == course_id,
        )
        .first()
    )
    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enrollment not found",
        )
    db.delete(enrollment)
    db.commit()


def get_enrollments_by_student(db: Session, student_id: int) -> list[dict]:
    enrollments = (
        db.query(Enrollment)
        .filter(Enrollment.student_id == student_id)
        .all()
    )
    return [
        {
            "student_id": e.student_id,
            "course_id": e.course_id,
            "course_name": e.course.course_name,
            "evaluation_score": e.evaluation_score,
        }
        for e in enrollments
    ]


def get_enrollments_by_course(db: Session, course_id: int) -> list[dict]:
    enrollments = (
        db.query(Enrollment)
        .filter(Enrollment.course_id == course_id)
        .all()
    )
    return [
        {
            "student_id": e.student_id,
            "course_id": e.course_id,
            "evaluation_score": e.evaluation_score,
            "student_name": e.student.user.email_id if e.student and e.student.user else None,
            "student_email": e.student.user.email_id if e.student and e.student.user else None,
        }
        for e in enrollments
    ]


def grade_student(db: Session, course_id: int, student_id: int, score: float) -> dict:
    enrollment = (
        db.query(Enrollment)
        .filter(Enrollment.course_id == course_id, Enrollment.student_id == student_id)
        .first()
    )
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    enrollment.evaluation_score = score
    db.commit()
    db.refresh(enrollment)
    return {
        "student_id": enrollment.student_id,
        "course_id": enrollment.course_id,
        "evaluation_score": enrollment.evaluation_score,
    }
