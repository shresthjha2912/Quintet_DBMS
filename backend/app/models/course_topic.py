from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class CourseTopic(Base):
    __tablename__ = "course_topics"

    course_id = Column(Integer, ForeignKey("courses.course_id"), primary_key=True)
    topic_id = Column(Integer, ForeignKey("topics.topic_id"), primary_key=True)

    course = relationship("Course", back_populates="course_topics")
    topic = relationship("Topic", back_populates="course_topics")
