from sqlalchemy.orm import Session
from sqlalchemy import func, case
from app.models.student import Student
from app.models.instructor import Instructor
from app.models.course import Course
from app.models.enrollment import Enrollment
from app.models.university import University
from app.models.content import Content
from app.models.user import User
from app.models.topic import Topic
from app.models.course_topic import CourseTopic
from app.models.textbook import Textbook
from app.models.textbook_used import TextbookUsed


def get_general_statistics(db: Session) -> dict:
    total_students = db.query(func.count(Student.student_id)).scalar()
    total_instructors = db.query(func.count(Instructor.instructor_id)).scalar()
    total_courses = db.query(func.count(Course.course_id)).scalar()
    total_enrollments = db.query(func.count()).select_from(Enrollment).scalar()
    total_universities = db.query(func.count(University.university_id)).scalar()
    total_contents = db.query(func.count(Content.content_id)).scalar()

    avg_evaluation = db.query(func.avg(Enrollment.evaluation_score)).scalar()

    courses_per_university = (
        db.query(
            University.name,
            func.count(Course.course_id).label("course_count"),
        )
        .join(Course, Course.university_id == University.university_id)
        .group_by(University.name)
        .all()
    )

    students_per_country = (
        db.query(
            Student.country,
            func.count(Student.student_id).label("student_count"),
        )
        .group_by(Student.country)
        .all()
    )

    students_per_skill = (
        db.query(
            Student.skill_level,
            func.count(Student.student_id).label("count"),
        )
        .group_by(Student.skill_level)
        .all()
    )

    score_distribution = []
    for lo, hi, label in [(0, 20, "0-20"), (21, 40, "21-40"), (41, 60, "41-60"), (61, 80, "61-80"), (81, 100, "81-100")]:
        cnt = db.query(func.count()).select_from(Enrollment).filter(
            Enrollment.evaluation_score >= lo,
            Enrollment.evaluation_score <= hi,
        ).scalar()
        score_distribution.append({"range": label, "count": cnt or 0})

    pass_count = db.query(func.count()).select_from(Enrollment).filter(Enrollment.evaluation_score >= 40).scalar() or 0
    fail_count = (total_enrollments or 0) - pass_count

    students_per_category = (
        db.query(Student.category, func.count(Student.student_id))
        .group_by(Student.category)
        .all()
    )

    courses_per_program = (
        db.query(Course.program_type, func.count(Course.course_id))
        .group_by(Course.program_type)
        .all()
    )

    avg_score_per_program = (
        db.query(Course.program_type, func.avg(Enrollment.evaluation_score))
        .join(Enrollment, Enrollment.course_id == Course.course_id)
        .group_by(Course.program_type)
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
        "pass_count": pass_count,
        "fail_count": fail_count,
        "courses_per_university": [
            {"university": name, "course_count": count}
            for name, count in courses_per_university
        ],
        "students_per_country": [
            {"country": country, "student_count": count}
            for country, count in students_per_country
        ],
        "students_per_skill_level": [
            {"skill_level": level, "count": count}
            for level, count in students_per_skill
        ],
        "students_per_category": [
            {"category": cat, "count": count}
            for cat, count in students_per_category
        ],
        "score_distribution": score_distribution,
        "courses_per_program_type": [
            {"program_type": pt, "count": count}
            for pt, count in courses_per_program
        ],
        "avg_score_per_program_type": [
            {"program_type": pt, "avg_score": round(avg, 2) if avg else 0}
            for pt, avg in avg_score_per_program
        ],
    }


def get_courses_summary(db: Session) -> list[dict]:
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
        max_score = (
            db.query(func.max(Enrollment.evaluation_score))
            .filter(Enrollment.course_id == course.course_id)
            .scalar()
        )
        min_score = (
            db.query(func.min(Enrollment.evaluation_score))
            .filter(Enrollment.course_id == course.course_id)
            .scalar()
        )
        pass_count = (
            db.query(func.count())
            .select_from(Enrollment)
            .filter(Enrollment.course_id == course.course_id, Enrollment.evaluation_score >= 40)
            .scalar()
        ) or 0
        content_count = (
            db.query(func.count(Content.content_id))
            .filter(Content.course_id == course.course_id)
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
            "max_score": max_score or 0.0,
            "min_score": min_score or 0.0,
            "pass_count": pass_count,
            "fail_count": (enrollment_count or 0) - pass_count,
            "content_count": content_count or 0,
        })
    return result


def get_enrollments_summary(db: Session) -> dict:
    total = db.query(func.count()).select_from(Enrollment).scalar()
    avg_score = db.query(func.avg(Enrollment.evaluation_score)).scalar()
    max_score = db.query(func.max(Enrollment.evaluation_score)).scalar()
    min_score = db.query(func.min(Enrollment.evaluation_score)).scalar()

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


def get_course_detail_for_analyst(db: Session, course_id: int) -> dict:
    course = db.query(Course).filter(Course.course_id == course_id).first()
    if not course:
        return {}

    rows = (
        db.query(Enrollment, Student, User)
        .join(Student, Enrollment.student_id == Student.student_id)
        .join(User, Student.user_id == User.user_id)
        .filter(Enrollment.course_id == course_id)
        .all()
    )

    enrolled_students = []
    scores = []
    for enroll, student, user in rows:
        scores.append(enroll.evaluation_score)
        enrolled_students.append({
            "student_id": student.student_id,
            "email": user.email_id,
            "age": student.age,
            "country": student.country,
            "skill_level": student.skill_level,
            "category": student.category,
            "evaluation_score": enroll.evaluation_score,
        })

    topics = (
        db.query(Topic.topic_name)
        .join(CourseTopic, CourseTopic.topic_id == Topic.topic_id)
        .filter(CourseTopic.course_id == course_id)
        .all()
    )

    textbooks = (
        db.query(Textbook)
        .join(TextbookUsed, TextbookUsed.textbook_id == Textbook.textbook_id)
        .filter(TextbookUsed.course_id == course_id)
        .all()
    )

    content_by_type = (
        db.query(Content.type, func.count(Content.content_id))
        .filter(Content.course_id == course_id)
        .group_by(Content.type)
        .all()
    )

    score_dist = []
    for lo, hi, label in [(0, 20, "0-20"), (21, 40, "21-40"), (41, 60, "41-60"), (61, 80, "61-80"), (81, 100, "81-100")]:
        cnt = db.query(func.count()).select_from(Enrollment).filter(
            Enrollment.course_id == course_id,
            Enrollment.evaluation_score >= lo,
            Enrollment.evaluation_score <= hi,
        ).scalar()
        score_dist.append({"range": label, "count": cnt or 0})

    skill_breakdown = (
        db.query(Student.skill_level, func.count(Student.student_id))
        .join(Enrollment, Enrollment.student_id == Student.student_id)
        .filter(Enrollment.course_id == course_id)
        .group_by(Student.skill_level)
        .all()
    )

    avg_score = sum(scores) / len(scores) if scores else 0
    pass_count = sum(1 for s in scores if s >= 40)

    return {
        "course_id": course.course_id,
        "course_name": course.course_name,
        "program_type": course.program_type,
        "duration": course.duration,
        "instructor_name": course.instructor.name if course.instructor else None,
        "instructor_expertise": course.instructor.expertise if course.instructor else None,
        "university_name": course.university.name if course.university else None,
        "enrollment_count": len(enrolled_students),
        "average_score": round(avg_score, 2),
        "max_score": max(scores) if scores else 0,
        "min_score": min(scores) if scores else 0,
        "pass_count": pass_count,
        "fail_count": len(scores) - pass_count,
        "pass_rate": round(pass_count / len(scores) * 100, 1) if scores else 0,
        "topics": [t[0] for t in topics],
        "textbooks": [
            {"title": tb.title, "author": tb.author, "link": tb.link}
            for tb in textbooks
        ],
        "content_by_type": [
            {"type": t, "count": c} for t, c in content_by_type
        ],
        "score_distribution": score_dist,
        "skill_level_breakdown": [
            {"skill_level": sl, "count": c} for sl, c in skill_breakdown
        ],
        "enrolled_students": enrolled_students,
    }


def get_student_detail_for_analyst(db: Session, student_id: int) -> dict:
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        return {}

    user = db.query(User).filter(User.user_id == student.user_id).first()

    rows = (
        db.query(Enrollment, Course, University.name, Instructor.name)
        .join(Course, Enrollment.course_id == Course.course_id)
        .outerjoin(University, Course.university_id == University.university_id)
        .outerjoin(Instructor, Course.instructor_id == Instructor.instructor_id)
        .filter(Enrollment.student_id == student_id)
        .all()
    )

    enrollments = []
    scores = []
    for enroll, course, uni_name, instr_name in rows:
        scores.append(enroll.evaluation_score)
        enrollments.append({
            "course_id": course.course_id,
            "course_name": course.course_name,
            "program_type": course.program_type,
            "duration": course.duration,
            "university_name": uni_name,
            "instructor_name": instr_name,
            "evaluation_score": enroll.evaluation_score,
        })

    avg_score = sum(scores) / len(scores) if scores else 0
    pass_count = sum(1 for s in scores if s >= 40)

    return {
        "student_id": student.student_id,
        "email": user.email_id if user else None,
        "age": student.age,
        "country": student.country,
        "skill_level": student.skill_level,
        "category": student.category,
        "total_courses_enrolled": len(enrollments),
        "average_score": round(avg_score, 2),
        "highest_score": max(scores) if scores else 0,
        "lowest_score": min(scores) if scores else 0,
        "pass_count": pass_count,
        "fail_count": len(scores) - pass_count,
        "enrollments": enrollments,
    }
