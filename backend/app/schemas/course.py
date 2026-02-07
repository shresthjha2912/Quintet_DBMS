from pydantic import BaseModel


class CourseCreate(BaseModel):
    course_name: str
    duration: str
    program_type: str
    instructor_id: int
    university_id: int


class CourseResponse(BaseModel):
    course_id: int
    course_name: str
    duration: str
    program_type: str
    instructor_id: int
    university_id: int

    class Config:
        from_attributes = True


class CourseWithInstructor(BaseModel):
    course_id: int
    course_name: str
    duration: str
    program_type: str
    instructor_name: str
    university_name: str

    class Config:
        from_attributes = True
