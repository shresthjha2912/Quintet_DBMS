from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.security import get_current_user

router = APIRouter()


@router.get("/")
async def get_students(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    # TODO: Implement get all students
    return {"message": "List of students"}


@router.get("/{student_id}")
async def get_student(student_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    # TODO: Implement get student by ID
    return {"message": f"Student {student_id}"}
