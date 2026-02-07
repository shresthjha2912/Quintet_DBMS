from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.security import get_current_user

router = APIRouter()


@router.get("/{course_id}")
async def get_course_content(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Get all content for a given course (accessible to enrolled students & instructors)."""
    # TODO: service logic will be added later
    pass
