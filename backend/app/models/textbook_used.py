from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class TextbookUsed(Base):
    __tablename__ = "textbooks_used"

    course_id = Column(Integer, ForeignKey("courses.course_id"), primary_key=True)
    textbook_id = Column(Integer, ForeignKey("textbooks.textbook_id"), primary_key=True)

    course = relationship("Course", back_populates="textbooks_used")
    textbook = relationship("Textbook", back_populates="textbooks_used")
