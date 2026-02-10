from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.core.security import require_instructor
from app.schemas.user import InstructorProfile
from app.services.auth_service import get_instructor_profile
from app.services.course_service import get_courses_by_instructor
from app.services.enroll_service import get_enrollments_by_course, grade_student

router = APIRouter()


class AddContentRequest(BaseModel):
    type: str       # "video", "pdf", "article", "link"
    content_url: str


@router.get("/profile")
async def get_my_profile(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_instructor),
):
    """Instructor views their own profile (name, expertise)."""
    return get_instructor_profile(db, current_user["user_id"])


@router.get("/my-courses")
async def my_courses(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_instructor),
):
    """Instructor views courses assigned to them."""
    from app.models.instructor import Instructor
    instructor = db.query(Instructor).filter(
        Instructor.user_id == current_user["user_id"]
    ).first()
    if not instructor:
        return []
    return get_courses_by_instructor(db, instructor.instructor_id)


@router.get("/courses/{course_id}/students")
async def course_students(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_instructor),
):
    """Instructor views students enrolled in a course (with names/emails)."""
    return get_enrollments_by_course(db, course_id)


@router.post("/courses/{course_id}/grade")
async def grade(
    course_id: int,
    student_id: int,
    score: float,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_instructor),
):
    """Instructor grades a student for a given course."""
    return grade_student(db, course_id, student_id, score)


@router.post("/courses/{course_id}/content", status_code=201)
async def add_content(
    course_id: int,
    body: AddContentRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_instructor),
):
    """Instructor adds a content link (video, pdf, article, link) to a course."""
    from app.models.content import Content
    from app.models.course import Course
    from fastapi import HTTPException, status

    course = db.query(Course).filter(Course.course_id == course_id).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")

    new_content = Content(
        course_id=course_id,
        type=body.type,
        content_url=body.content_url,
    )
    db.add(new_content)
    db.commit()
    db.refresh(new_content)
    return {
        "content_id": new_content.content_id,
        "course_id": new_content.course_id,
        "type": new_content.type,
        "content_url": new_content.content_url,
    }


@router.delete("/courses/{course_id}/content/{content_id}")
async def delete_content(
    course_id: int,
    content_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_instructor),
):
    """Instructor deletes a content link from a course."""
    from app.models.content import Content
    from fastapi import HTTPException, status

    content = db.query(Content).filter(
        Content.content_id == content_id,
        Content.course_id == course_id,
    ).first()
    if not content:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Content not found")

    db.delete(content)
    db.commit()
    return {"message": "Content deleted"}
