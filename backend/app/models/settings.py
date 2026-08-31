from datetime import datetime
from sqlalchemy import Column, String, DateTime, JSON, ForeignKey
from app.db.base import GUID
from sqlalchemy.orm import relationship
from app.db.base import Base

class SiteSetting(Base):
    __tablename__ = "site_settings"

    key = Column(String(50), primary_key=True, index=True)  # upi_id, upi_payee_name, upi_qr_url, org_phone, hero_title
    value = Column(JSON, nullable=False)
    description = Column(String(255), nullable=True)
    updated_by_user_id = Column(GUID, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    updated_by = relationship("User", lazy="selectin")
