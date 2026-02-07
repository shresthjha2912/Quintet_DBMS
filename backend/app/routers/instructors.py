from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.security import require_instructor
from app.schemas.user import InstructorProfile
from app.services.auth_service import get_instructor_profile
from app.services.course_service import get_courses_by_instructor

router = APIRouter()


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
