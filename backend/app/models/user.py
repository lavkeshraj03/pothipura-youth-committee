from datetime import datetime
import uuid
from sqlalchemy import Column, String, Boolean, DateTime
from app.db.base import GUID
from sqlalchemy.orm import relationship
from app.db.base import Base
from app.models.rbac import user_roles

class User(Base):
    __tablename__ = "users"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    mobile = Column(String(15), unique=True, nullable=False, index=True)
    full_name = Column(String(100), nullable=False)
    password_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    roles = relationship("Role", secondary=user_roles, back_populates="users", lazy="selectin")
