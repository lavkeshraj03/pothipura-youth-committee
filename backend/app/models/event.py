from datetime import datetime
import uuid
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Numeric, ForeignKey
from app.db.base import GUID
from sqlalchemy.orm import relationship
from app.db.base import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    title_hi = Column(String(200), nullable=False)
    title_en = Column(String(200), nullable=False)
    event_type = Column(String(50), default="RELIGIOUS")  # RELIGIOUS, CULTURAL, EDUCATIONAL, SPORTS
    description_hi = Column(Text, nullable=True)
    description_en = Column(Text, nullable=True)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    venue = Column(String(255), nullable=False)
    cover_image_url = Column(String(255), nullable=True)
    poster_url = Column(String(255), nullable=True)
    target_donation_amount = Column(Numeric(12, 2), default=0.0)
    status = Column(String(30), default="UPCOMING")  # UPCOMING, ACTIVE, COMPLETED, ARCHIVED
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    programs = relationship("EventProgram", back_populates="event", cascade="all, delete-orphan", lazy="selectin")
    donations = relationship("Donation", back_populates="event")
    expenses = relationship("Expense", back_populates="event")
    announcements = relationship("Announcement", back_populates="event")
    posters = relationship("Poster", back_populates="event")

class EventProgram(Base):
    __tablename__ = "event_programs"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(GUID, ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    time_label = Column(String(50), nullable=False)  # e.g., "5:00 PM", "12:00 AM"
    title_hi = Column(String(200), nullable=False)
    title_en = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    display_order = Column(Integer, default=0)

    event = relationship("Event", back_populates="programs")
