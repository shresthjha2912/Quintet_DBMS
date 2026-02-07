from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.security import get_current_user
from app.schemas.course import CourseCreate, CourseResponse
from app.services.course_service import create_course, get_all_courses, get_course_by_id

router = APIRouter()


@router.get("/")
async def list_courses(db: Session = Depends(get_db)):
    return get_all_courses(db)


@router.get("/{course_id}")
async def get_course(course_id: int, db: Session = Depends(get_db)):
    return get_course_by_id(db, course_id)


@router.post("/", response_model=CourseResponse, status_code=201)
async def add_course(course: CourseCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return create_course(db, course)
