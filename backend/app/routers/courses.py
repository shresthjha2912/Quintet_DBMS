from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.security import get_current_user
from app.schemas.course import CourseResponse
from app.services.course_service import get_all_courses, get_course_by_id

router = APIRouter()


@router.get("/", response_model=list[CourseResponse])
async def list_courses(db: Session = Depends(get_db)):
    """Public: list all courses (used by student browse page)."""
    return get_all_courses(db)


@router.get("/{course_id}", response_model=CourseResponse)
async def get_course(course_id: int, db: Session = Depends(get_db)):
    """Public: get a single course by ID."""
    return get_course_by_id(db, course_id)


@router.get("/{course_id}/textbooks")
async def get_course_textbooks(course_id: int, db: Session = Depends(get_db)):
    """Public: get textbooks linked to a course."""
    from app.models.textbook_used import TextbookUsed
    from app.models.textbook import Textbook

    rows = (
        db.query(Textbook)
        .join(TextbookUsed, TextbookUsed.textbook_id == Textbook.textbook_id)
        .filter(TextbookUsed.course_id == course_id)
        .all()
    )
    return [
        {
            "textbook_id": t.textbook_id,
            "title": t.title,
            "author": t.author,
            "link": t.link,
        }
        for t in rows
    ]
