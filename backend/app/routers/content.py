from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.security import get_current_user

router = APIRouter()


@router.get("/")
async def get_contents(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    # TODO: Implement get all content
    return {"message": "List of content"}


@router.get("/{content_id}")
async def get_content(content_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    # TODO: Implement get content by ID
    return {"message": f"Content {content_id}"}


@router.post("/")
async def create_content(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    # TODO: Implement create content
    return {"message": "Content created"}
