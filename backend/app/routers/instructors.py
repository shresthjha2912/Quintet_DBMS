from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.security import get_current_user

router = APIRouter()


@router.get("/")
async def get_instructors(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    # TODO: Implement get all instructors
    return {"message": "List of instructors"}


@router.get("/{instructor_id}")
async def get_instructor(instructor_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    # TODO: Implement get instructor by ID
    return {"message": f"Instructor {instructor_id}"}
