from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Course(Base):
    __tablename__ = "courses"

    course_id = Column(Integer, primary_key=True, index=True)
    course_name = Column(String, nullable=False)
    duration = Column(String, nullable=False)
    program_type = Column(String, nullable=False)
    instructor_id = Column(Integer, ForeignKey("instructors.instructor_id"), nullable=False)
    university_id = Column(Integer, ForeignKey("universities.university_id"), nullable=False)

    instructor = relationship("Instructor", back_populates="courses")
    university = relationship("University", back_populates="courses")
    enrollments = relationship("Enrollment", back_populates="course")
    contents = relationship("Content", back_populates="course")
    course_topics = relationship("CourseTopic", back_populates="course")
    textbooks_used = relationship("TextbookUsed", back_populates="course")
