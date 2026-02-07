from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.database import Base


class Content(Base):
    __tablename__ = "contents"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    title = Column(String, nullable=False)
    body = Column(Text)
    content_type = Column(String)  # "lecture", "assignment", "resource"
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    course = relationship("Course", back_populates="contents")
