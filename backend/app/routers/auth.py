from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import StudentSignup, UserLogin, Token
from app.services.auth_service import (
    register_student,
    login_user,
)

router = APIRouter()


@router.post("/student/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
async def student_signup(data: StudentSignup, db: Session = Depends(get_db)):
    return register_student(db, data)


@router.post("/student/login", response_model=Token)
async def student_login(data: UserLogin, db: Session = Depends(get_db)):
    return login_user(db, data.email_id, data.password, expected_role="student")


@router.post("/instructor/login", response_model=Token)
async def instructor_login(data: UserLogin, db: Session = Depends(get_db)):
    return login_user(db, data.email_id, data.password, expected_role="instructor")


@router.post("/analyst/login", response_model=Token)
async def analyst_login(data: UserLogin, db: Session = Depends(get_db)):
    return login_user(db, data.email_id, data.password, expected_role="analyst")


@router.post("/admin/login", response_model=Token)
async def admin_login(data: UserLogin, db: Session = Depends(get_db)):
    return login_user(db, data.email_id, data.password, expected_role="admin")
