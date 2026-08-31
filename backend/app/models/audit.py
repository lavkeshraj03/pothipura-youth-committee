from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base, GUID

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(GUID, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action = Column(String(50), nullable=False, index=True)  # DONATION_VERIFY, CASH_DONATION_CREATE, EXPENSE_ADD, etc.
    entity = Column(String(50), nullable=False)  # donations, expenses, settings, members
    entity_id = Column(String(50), nullable=False)
    old_values = Column(JSON, nullable=True)
    new_values = Column(JSON, nullable=True)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", lazy="selectin")
