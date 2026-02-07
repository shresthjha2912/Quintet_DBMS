from pydantic import BaseModel


class EnrollmentCreate(BaseModel):
    student_id: int
    course_id: int


class EnrollmentResponse(BaseModel):
    student_id: int
    course_id: int
    evaluation_score: float

    class Config:
        from_attributes = True


class EnrollmentWithDetails(BaseModel):
    """Enrollment with course name for student profile view"""
    student_id: int
    course_id: int
    course_name: str
    evaluation_score: float

    class Config:
        from_attributes = True
