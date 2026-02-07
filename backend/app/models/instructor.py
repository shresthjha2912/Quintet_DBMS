from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Instructor(Base):
    __tablename__ = "instructors"

    instructor_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), unique=True, nullable=False)
    name = Column(String, nullable=False)
    expertise = Column(String, nullable=False)

    user = relationship("User", back_populates="instructor")
    courses = relationship("Course", back_populates="instructor")
