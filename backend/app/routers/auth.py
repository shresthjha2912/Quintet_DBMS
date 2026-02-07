from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import StudentSignup, UserLogin, Token
from app.services.auth_service import (
    register_student,
    login_user,
)

router = APIRouter()


# ==================== STUDENT AUTH ====================

@router.post("/student/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
async def student_signup(data: StudentSignup, db: Session = Depends(get_db)):
    """
    Student sign-up: creates a User (role=student) + Student record, returns JWT.
    Only students can sign up.
    """
    return register_student(db, data)


@router.post("/student/login", response_model=Token)
async def student_login(data: UserLogin, db: Session = Depends(get_db)):
    """Student login — only allows role=student"""
    return login_user(db, data.email_id, data.password, expected_role="student")


# ==================== INSTRUCTOR AUTH ====================

@router.post("/instructor/login", response_model=Token)
async def instructor_login(data: UserLogin, db: Session = Depends(get_db)):
    """
    Instructor login — no signup (admin creates instructors).
    Only allows role=instructor.
    """
    return login_user(db, data.email_id, data.password, expected_role="instructor")


# ==================== ANALYST AUTH ====================

@router.post("/analyst/login", response_model=Token)
async def analyst_login(data: UserLogin, db: Session = Depends(get_db)):
    """
    Analyst login — no signup (admin creates analysts or predefined).
    Only allows role=analyst.
    """
    return login_user(db, data.email_id, data.password, expected_role="analyst")


# ==================== ADMIN AUTH ====================

@router.post("/admin/login", response_model=Token)
async def admin_login(data: UserLogin, db: Session = Depends(get_db)):
    """
    Admin login — predefined credentials, only one admin.
    Only allows role=admin.
    """
    return login_user(db, data.email_id, data.password, expected_role="admin")
