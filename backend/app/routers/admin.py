from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.security import get_current_user

router = APIRouter()


@router.get("/dashboard")
async def admin_dashboard(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    # TODO: Implement admin dashboard
    return {"message": "Admin dashboard"}


@router.get("/users")
async def list_all_users(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    # TODO: Implement list all users
    return {"message": "All users"}
