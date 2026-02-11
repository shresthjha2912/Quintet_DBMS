from pydantic import BaseModel, EmailStr
from typing import Optional


class UserLogin(BaseModel):
    email_id: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: int


class TokenData(BaseModel):
    email_id: Optional[str] = None
    role: Optional[str] = None
    user_id: Optional[int] = None


class StudentSignup(BaseModel):
    email_id: EmailStr
    password: str
    age: int
    skill_level: str
    category: str
    country: str


class UserResponse(BaseModel):
    user_id: int
    email_id: str
    role: str

    class Config:
        from_attributes = True


class StudentProfile(BaseModel):
    student_id: int
    user_id: int
    email_id: str
    age: int
    skill_level: str
    category: str
    country: str

    class Config:
        from_attributes = True


class InstructorProfile(BaseModel):
    instructor_id: int
    user_id: int
    email_id: str
    name: str
    expertise: str

    class Config:
        from_attributes = True


class AdminCreateInstructor(BaseModel):
    email_id: EmailStr
    password: str
    name: str
    expertise: str


class AdminCreateCourse(BaseModel):
    course_name: str
    duration: str
    program_type: str
    instructor_id: int
    university_id: int


class AdminAssignInstructor(BaseModel):
    course_id: int
    instructor_id: int
