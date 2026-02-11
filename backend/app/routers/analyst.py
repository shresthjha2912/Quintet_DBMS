from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.security import require_analyst
from app.services.analyst_service import (
    get_general_statistics,
    get_courses_summary,
    get_enrollments_summary,
    get_course_detail_for_analyst,
    get_student_detail_for_analyst,
)

router = APIRouter()


@router.get("/statistics")
async def get_statistics(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_analyst),
):
    return get_general_statistics(db)


@router.get("/courses/summary")
async def courses_summary(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_analyst),
):
    return get_courses_summary(db)


@router.get("/enrollments/summary")
async def enrollments_summary(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_analyst),
):
    return get_enrollments_summary(db)


@router.get("/courses/{course_id}")
async def course_detail(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_analyst),
):
    return get_course_detail_for_analyst(db, course_id)


@router.get("/students/{student_id}")
async def student_detail(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_analyst),
):
    return get_student_detail_for_analyst(db, student_id)
