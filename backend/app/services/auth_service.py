from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.models.student import Student
from app.schemas.user import StudentSignup
from app.core.security import hash_password, verify_password, create_access_token


def register_student(db: Session, data: StudentSignup) -> dict:
    """
    Student signup flow:
    1. Create a User row (role=student)
    2. Create a Student row linked to that User
    3. Return a JWT token
    """
    # TODO: add your query logic here
    pass


def login_user(db: Session, email_id: str, password: str, expected_role: str) -> dict:
    """
    Generic login for all roles.
    Verifies email + password + role match, then returns JWT.
    """
    # TODO: add your query logic here
    pass
