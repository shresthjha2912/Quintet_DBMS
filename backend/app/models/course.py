from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.database import Base


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String)
    code = Column(String, unique=True, nullable=False)
    instructor_id = Column(Integer, ForeignKey("instructors.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    instructor = relationship("Instructor", back_populates="courses")
    enrollments = relationship("Enrollment", back_populates="course")
    contents = relationship("Content", back_populates="course")
