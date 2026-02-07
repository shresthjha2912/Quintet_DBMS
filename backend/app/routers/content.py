from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.security import get_current_user
from app.models.content import Content

router = APIRouter()


@router.get("/{course_id}")
async def get_course_content(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Get all content for a given course."""
    contents = db.query(Content).filter(Content.course_id == course_id).all()
    return [
        {
            "content_id": c.content_id,
            "course_id": c.course_id,
            "type": c.type,
            "content_url": c.content_url,
        }
        for c in contents
    ]
