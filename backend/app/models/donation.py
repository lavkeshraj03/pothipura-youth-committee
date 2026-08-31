from datetime import datetime
import uuid
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Numeric, ForeignKey
from app.db.base import GUID
from sqlalchemy.orm import relationship
from app.db.base import Base

class Donor(Base):
    __tablename__ = "donors"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    full_name = Column(String(100), nullable=False)
    mobile = Column(String(15), nullable=False, index=True)
    email = Column(String(100), nullable=True)
    address = Column(Text, nullable=True)
    is_anonymous_by_default = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    donations = relationship("Donation", back_populates="donor")

class Donation(Base):
    __tablename__ = "donations"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    donor_id = Column(GUID, ForeignKey("donors.id", ondelete="RESTRICT"), nullable=False)
    event_id = Column(GUID, ForeignKey("events.id", ondelete="SET NULL"), nullable=True)
    amount = Column(Numeric(12, 2), nullable=False)
    purpose = Column(String(50), default="JANMASHTAMI")  # JANMASHTAMI, EDUCATION, COMMUNITY, GENERAL
    payment_method = Column(String(30), nullable=False)  # UPI_ONLINE, CASH, BANK_TRANSFER
    transaction_ref = Column(String(100), nullable=True)  # UTR / UPI Ref / Cash Voucher
    status = Column(String(30), default="PENDING", index=True)  # PENDING, PAYMENT_SUBMITTED, VERIFIED, REJECTED, REFUNDED
    is_anonymous = Column(Boolean, default=False)
    donor_message = Column(Text, nullable=True)
    
    # Audit & Collector tracking
    collected_by_user_id = Column(GUID, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    collected_at = Column(DateTime, default=datetime.utcnow)
    
    verified_by_user_id = Column(GUID, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    verified_at = Column(DateTime, nullable=True)
    rejection_reason = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    donor = relationship("Donor", back_populates="donations", lazy="selectin")
    event = relationship("Event", back_populates="donations", lazy="selectin")
    receipt = relationship("DonationReceipt", back_populates="donation", uselist=False, lazy="selectin")
    collected_by = relationship("User", foreign_keys=[collected_by_user_id], lazy="selectin")
    verified_by = relationship("User", foreign_keys=[verified_by_user_id], lazy="selectin")

class DonationReceipt(Base):
    __tablename__ = "donation_receipts"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    donation_id = Column(GUID, ForeignKey("donations.id", ondelete="RESTRICT"), unique=True, nullable=False)
    receipt_number = Column(String(50), unique=True, nullable=False, index=True)  # YOUTH-2026-000001
    issued_at = Column(DateTime, default=datetime.utcnow)
    pdf_file_path = Column(String(255), nullable=False)
    download_hash = Column(String(64), unique=True, nullable=False, index=True)
    is_active = Column(Boolean, default=True)

    donation = relationship("Donation", back_populates="receipt")
