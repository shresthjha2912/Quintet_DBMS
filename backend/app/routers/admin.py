from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.security import require_admin
from app.schemas.user import (
    AdminCreateInstructor,
    AdminCreateCourse,
    AdminAssignInstructor,
    InstructorProfile,
)
from app.schemas.course import CourseResponse

router = APIRouter()


# ==================== INSTRUCTOR MANAGEMENT ====================

@router.post("/instructors", status_code=201)
async def create_instructor(
    data: AdminCreateInstructor,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin),
):
    """Admin creates a new instructor (User + Instructor record)."""
    # TODO: service logic will be added later
    pass


@router.get("/instructors")
async def list_instructors(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin),
):
    """Admin lists all instructors."""
    # TODO: service logic will be added later
    pass


# ==================== COURSE MANAGEMENT ====================

@router.post("/courses", status_code=201)
async def create_course(
    data: AdminCreateCourse,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin),
):
    """Admin creates a new course."""
    # TODO: service logic will be added later
    pass


@router.delete("/courses/{course_id}")
async def delete_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin),
):
    """Admin deletes a course."""
    # TODO: service logic will be added later
    pass


@router.put("/courses/assign-instructor")
async def assign_instructor_to_course(
    data: AdminAssignInstructor,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin),
):
    """Admin assigns an instructor to a course."""
    # TODO: service logic will be added later
    pass


# ==================== STUDENT MANAGEMENT ====================

@router.get("/students")
async def list_students(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin),
):
    """Admin lists all students."""
    # TODO: service logic will be added later
    pass


@router.delete("/students/{student_id}")
async def remove_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin),
):
    """Admin removes a student."""
    # TODO: service logic will be added later
    pass


@router.post("/students/{student_id}/enroll/{course_id}")
async def admin_enroll_student(
    student_id: int,
    course_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin),
):
    """Admin enrolls a student in a course."""
    # TODO: service logic will be added later
    pass


@router.delete("/students/{student_id}/drop/{course_id}")
async def admin_drop_student(
    student_id: int,
    course_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin),
):
    """Admin drops a student from a course."""
    # TODO: service logic will be added later
    pass
