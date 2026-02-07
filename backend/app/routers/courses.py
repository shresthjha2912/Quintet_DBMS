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
