from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.security import require_admin
from app.schemas.user import (
    AdminCreateInstructor,
    AdminCreateCourse,
    AdminAssignInstructor,
)
from app.services.auth_service import (
    create_instructor,
    get_all_students,
    get_all_instructors,
    remove_student,
    remove_instructor,
    get_student_by_id,
    get_instructor_by_id,
)
from app.services.course_service import (
    create_course,
    delete_course,
    assign_instructor,
    get_course_detail,
)
from app.services.enroll_service import enroll_student, drop_student
from app.schemas.enrollment import EnrollmentCreate

router = APIRouter()


# ==================== INSTRUCTOR MANAGEMENT ====================

@router.post("/instructors", status_code=201)
async def admin_create_instructor(
    data: AdminCreateInstructor,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin),
):
    """Admin creates a new instructor (User + Instructor record)."""
    return create_instructor(db, data)


@router.get("/instructors")
async def list_instructors(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin),
):
    """Admin lists all instructors."""
    return get_all_instructors(db)


@router.get("/instructors/{instructor_id}")
async def get_instructor_detail(
    instructor_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin),
):
    """Admin views a single instructor with their courses."""
    return get_instructor_by_id(db, instructor_id)


# ==================== COURSE MANAGEMENT ====================

@router.post("/courses", status_code=201)
async def admin_create_course(
    data: AdminCreateCourse,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin),
):
    """Admin creates a new course."""
    from app.schemas.course import CourseCreate
    course_create = CourseCreate(
        course_name=data.course_name,
        duration=data.duration,
        program_type=data.program_type,
        instructor_id=data.instructor_id,
        university_id=data.university_id,
    )
    return create_course(db, course_create)


@router.get("/courses/{course_id}")
async def admin_get_course_detail(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin),
):
    """Admin views a single course with instructor info and enrolled students."""
    return get_course_detail(db, course_id)


@router.delete("/courses/{course_id}")
async def admin_delete_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin),
):
    """Admin deletes a course."""
    delete_course(db, course_id)
    return {"message": f"Course {course_id} deleted successfully"}


@router.put("/courses/assign-instructor")
async def assign_instructor_to_course(
    data: AdminAssignInstructor,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin),
):
    """Admin assigns an instructor to a course."""
    return assign_instructor(db, data.course_id, data.instructor_id)


# ==================== STUDENT MANAGEMENT ====================

@router.get("/students")
async def list_students(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin),
):
    """Admin lists all students."""
    return get_all_students(db)


@router.get("/students/{student_id}")
async def get_student_detail(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin),
):
    """Admin views a single student with their enrollments."""
    return get_student_by_id(db, student_id)


@router.delete("/students/{student_id}")
async def admin_remove_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin),
):
    """Admin removes a student."""
    remove_student(db, student_id)
    return {"message": f"Student {student_id} removed successfully"}


@router.post("/students/{student_id}/enroll/{course_id}", status_code=201)
async def admin_enroll_student(
    student_id: int,
    course_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin),
):
    """Admin enrolls a student in a course."""
    enrollment_data = EnrollmentCreate(student_id=student_id, course_id=course_id)
    return enroll_student(db, enrollment_data)


@router.delete("/students/{student_id}/drop/{course_id}")
async def admin_drop_student(
    student_id: int,
    course_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin),
):
    """Admin drops a student from a course."""
    drop_student(db, student_id, course_id)
    return {"message": f"Student {student_id} dropped from course {course_id}"}



@router.delete("/instructors/{instructor_id}")
async def admin_remove_instructor(
    instructor_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin),
):
    """Admin removes an instructor and their user account."""
    remove_instructor(db, instructor_id)
    return {"message": f"Instructor {instructor_id} removed successfully"}
