from datetime import datetime, date
import uuid
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, Text, Numeric, ForeignKey
from app.db.base import GUID
from sqlalchemy.orm import relationship
from app.db.base import Base

class ExpenseCategory(Base):
    __tablename__ = "expense_categories"

    id = Column(Integer, primary_key=True, index=True)
    name_hi = Column(String(100), nullable=False)
    name_en = Column(String(100), nullable=False)
    is_active = Column(Boolean, default=True)

    expenses = relationship("Expense", back_populates="category")

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    event_id = Column(GUID, ForeignKey("events.id", ondelete="RESTRICT"), nullable=True)
    category_id = Column(Integer, ForeignKey("expense_categories.id", ondelete="RESTRICT"), nullable=False)
    amount = Column(Numeric(12, 2), nullable=False)
    description = Column(Text, nullable=False)
    committee_member_id = Column(GUID, ForeignKey("committee_members.id", ondelete="RESTRICT"), nullable=True)
    vendor_name = Column(String(150), nullable=True)
    payment_method = Column(String(30), default="CASH")  # CASH, UPI, BANK_TRANSFER
    expense_date = Column(Date, default=date.today)
    status = Column(String(30), default="APPROVED")  # PENDING, APPROVED, VOIDED
    created_by_user_id = Column(GUID, ForeignKey("users.id", ondelete="RESTRICT"), nullable=True)
    approved_by_user_id = Column(GUID, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    is_public_disclosed = Column(Boolean, default=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    category = relationship("ExpenseCategory", back_populates="expenses", lazy="selectin")
    event = relationship("Event", back_populates="expenses", lazy="selectin")
    committee_member = relationship("CommitteeMember", back_populates="expenses", lazy="selectin")
    created_by = relationship("User", foreign_keys=[created_by_user_id], lazy="selectin")
    approved_by = relationship("User", foreign_keys=[approved_by_user_id], lazy="selectin")
    attachments = relationship("ExpenseAttachment", back_populates="expense", cascade="all, delete-orphan", lazy="selectin")

class ExpenseAttachment(Base):
    __tablename__ = "expense_attachments"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    expense_id = Column(GUID, ForeignKey("expenses.id", ondelete="CASCADE"), nullable=False)
    file_path = Column(String(255), nullable=False)
    file_name = Column(String(255), nullable=False)
    is_public = Column(Boolean, default=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    expense = relationship("Expense", back_populates="attachments")
