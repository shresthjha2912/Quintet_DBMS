from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    email_id = Column(String, unique=True, index=True, nullable=False)
    role = Column(String, nullable=False)  # "student", "instructor", "analyst", "admin"
    password = Column(String, nullable=False)

    # Relationships
    student = relationship("Student", back_populates="user", uselist=False)
    instructor = relationship("Instructor", back_populates="user", uselist=False)
