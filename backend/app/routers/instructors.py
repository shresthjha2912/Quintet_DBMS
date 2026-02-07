from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.security import require_instructor
from app.schemas.user import InstructorProfile

router = APIRouter()


@router.get("/profile", response_model=InstructorProfile)
async def get_my_profile(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_instructor),
):
    """Instructor views their own profile (name, expertise, assigned courses)."""
    # TODO: service logic will be added later
    pass


@router.get("/my-courses")
async def my_courses(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_instructor),
):
    """Instructor views courses assigned to them."""
    # TODO: service logic will be added later
    pass
