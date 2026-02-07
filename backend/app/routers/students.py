from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.security import require_student, get_current_user
from app.schemas.user import StudentProfile
from app.schemas.enrollment import EnrollmentCreate, EnrollmentResponse
from app.services.course_service import get_all_courses
from app.services.enroll_service import enroll_student, get_enrollments_by_student

router = APIRouter()


@router.get("/profile", response_model=StudentProfile)
async def get_my_profile(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_student),
):
    """Student views their own profile."""
    # TODO: service logic will be added later
    pass


@router.get("/courses")
async def browse_courses(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_student),
):
    """Student browses available courses to enroll in."""
    return get_all_courses(db)


@router.post("/enroll", response_model=EnrollmentResponse, status_code=201)
async def add_course(
    enrollment: EnrollmentCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_student),
):
    """Student enrolls in a course."""
    return enroll_student(db, enrollment)


@router.get("/my-courses")
async def my_enrolled_courses(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_student),
):
    """Student views their enrolled courses."""
    # TODO: service logic will be added later
    pass
