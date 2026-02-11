from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Content(Base):
    __tablename__ = "contents"

    content_id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.course_id"), nullable=False)
    type = Column(String, nullable=False)
    content_url = Column(String, nullable=False)

    course = relationship("Course", back_populates="contents")
