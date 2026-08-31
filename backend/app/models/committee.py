from datetime import datetime, date
import uuid
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, Text, ForeignKey, JSON
from app.db.base import GUID
from sqlalchemy.orm import relationship
from app.db.base import Base

class Designation(Base):
    __tablename__ = "designations"

    id = Column(Integer, primary_key=True, index=True)
    title_hi = Column(String(100), nullable=False)
    title_en = Column(String(100), nullable=False)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    members = relationship("CommitteeMember", back_populates="designation")

class CommitteeMember(Base):
    __tablename__ = "committee_members"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    full_name = Column(String(100), nullable=False)
    mobile = Column(String(15), nullable=False)
    email = Column(String(100), nullable=True)
    address = Column(Text, nullable=True)
    designation_id = Column(Integer, ForeignKey("designations.id", ondelete="RESTRICT"), nullable=True)
    custom_designation = Column(String(100), nullable=True)
    joining_date = Column(Date, default=date.today)
    bio = Column(Text, nullable=True)
    profile_photo_url = Column(String(255), nullable=True)
    social_links = Column(JSON, default={})
    is_active = Column(Boolean, default=True)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    designation = relationship("Designation", back_populates="members", lazy="selectin")
    expenses = relationship("Expense", back_populates="committee_member")
