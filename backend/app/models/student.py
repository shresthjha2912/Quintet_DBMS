from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Student(Base):
    __tablename__ = "students"

    student_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), unique=True, nullable=False)
    age = Column(Integer, nullable=False)
    skill_level = Column(String, nullable=False)
    category = Column(String, nullable=False)
    country = Column(String, nullable=False)

    user = relationship("User", back_populates="student")
    enrollments = relationship("Enrollment", back_populates="student")
