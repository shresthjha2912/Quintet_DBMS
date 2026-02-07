from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base


class University(Base):
    __tablename__ = "universities"

    university_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    country = Column(String, nullable=False)

    courses = relationship("Course", back_populates="university")
