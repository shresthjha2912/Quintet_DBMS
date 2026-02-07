from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base


class Topic(Base):
    __tablename__ = "topics"

    topic_id = Column(Integer, primary_key=True, index=True)
    topic_name = Column(String, nullable=False)

    course_topics = relationship("CourseTopic", back_populates="topic")
