from datetime import datetime
import uuid
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Date, ForeignKey
from app.db.base import GUID
from sqlalchemy.orm import relationship
from app.db.base import Base

class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    event_id = Column(GUID, ForeignKey("events.id", ondelete="SET NULL"), nullable=True)
    title_hi = Column(String(255), nullable=False)
    title_en = Column(String(255), nullable=False)
    description_hi = Column(Text, nullable=False)
    description_en = Column(Text, nullable=False)
    priority = Column(String(20), default="NORMAL")  # LOW, NORMAL, HIGH, CRITICAL
    image_url = Column(String(255), nullable=True)
    is_published = Column(Boolean, default=True)
    publish_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    event = relationship("Event", back_populates="announcements")

class Poster(Base):
    __tablename__ = "posters"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    event_id = Column(GUID, ForeignKey("events.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String(255), nullable=False)
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    expiry_date = Column(Date, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    event = relationship("Event", back_populates="posters")
