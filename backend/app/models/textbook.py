from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base


class Textbook(Base):
    __tablename__ = "textbooks"

    textbook_id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    author = Column(String, nullable=False)
    link = Column(String, nullable=True)

    textbooks_used = relationship("TextbookUsed", back_populates="textbook")
