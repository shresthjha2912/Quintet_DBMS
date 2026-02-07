from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.student import Student
from app.models.instructor import Instructor
from app.models.course import Course
from app.models.enrollment import Enrollment
from app.models.university import University
from app.models.content import Content


def get_general_statistics(db: Session) -> dict:
    """General statistics of the entire database."""
    total_students = db.query(func.count(Student.student_id)).scalar()
    total_instructors = db.query(func.count(Instructor.instructor_id)).scalar()
    total_courses = db.query(func.count(Course.course_id)).scalar()
    total_enrollments = db.query(func.count()).select_from(Enrollment).scalar()
    total_universities = db.query(func.count(University.university_id)).scalar()
    total_contents = db.query(func.count(Content.content_id)).scalar()

    avg_evaluation = db.query(func.avg(Enrollment.evaluation_score)).scalar()

    # Courses per university
    courses_per_university = (
        db.query(
            University.name,
            func.count(Course.course_id).label("course_count"),
        )
        .join(Course, Course.university_id == University.university_id)
        .group_by(University.name)
        .all()
    )

    # Students per country
    students_per_country = (
        db.query(
            Student.country,
            func.count(Student.student_id).label("student_count"),
        )
        .group_by(Student.country)
        .all()
    )

    return {
        "total_students": total_students,
        "total_instructors": total_instructors,
        "total_courses": total_courses,
        "total_enrollments": total_enrollments,
        "total_universities": total_universities,
        "total_contents": total_contents,
        "average_evaluation_score": round(avg_evaluation, 2) if avg_evaluation else 0.0,
        "courses_per_university": [
            {"university": name, "course_count": count}
            for name, count in courses_per_university
        ],
        "students_per_country": [
            {"country": country, "student_count": count}
            for country, count in students_per_country
        ],
    }


def get_courses_summary(db: Session) -> list[dict]:
    """Per-course statistics: enrollment count, avg score, instructor name."""
    courses = db.query(Course).all()
    result = []
    for course in courses:
        enrollment_count = (
            db.query(func.count())
            .select_from(Enrollment)
            .filter(Enrollment.course_id == course.course_id)
            .scalar()
        )
        avg_score = (
            db.query(func.avg(Enrollment.evaluation_score))
            .filter(Enrollment.course_id == course.course_id)
            .scalar()
        )
        result.append({
            "course_id": course.course_id,
            "course_name": course.course_name,
            "program_type": course.program_type,
            "duration": course.duration,
            "instructor_name": course.instructor.name if course.instructor else None,
            "university_name": course.university.name if course.university else None,
            "enrollment_count": enrollment_count,
            "average_score": round(avg_score, 2) if avg_score else 0.0,
        })
    return result


def get_enrollments_summary(db: Session) -> dict:
    """Enrollment-level aggregate statistics."""
    total = db.query(func.count()).select_from(Enrollment).scalar()
    avg_score = db.query(func.avg(Enrollment.evaluation_score)).scalar()
    max_score = db.query(func.max(Enrollment.evaluation_score)).scalar()
    min_score = db.query(func.min(Enrollment.evaluation_score)).scalar()

    # Top 5 most enrolled courses
    top_courses = (
        db.query(
            Course.course_name,
            func.count(Enrollment.student_id).label("enrollment_count"),
        )
        .join(Enrollment, Enrollment.course_id == Course.course_id)
        .group_by(Course.course_name)
        .order_by(func.count(Enrollment.student_id).desc())
        .limit(5)
        .all()
    )

    return {
        "total_enrollments": total,
        "average_score": round(avg_score, 2) if avg_score else 0.0,
        "max_score": max_score or 0.0,
        "min_score": min_score or 0.0,
        "top_5_courses_by_enrollment": [
            {"course_name": name, "enrollment_count": count}
            for name, count in top_courses
        ],
    }
