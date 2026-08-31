from datetime import datetime
import uuid
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Table
from app.db.base import GUID
from sqlalchemy.orm import relationship
from app.db.base import Base

role_permissions = Table(
    "role_permissions",
    Base.metadata,
    Column("role_id", Integer, ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True),
    Column("permission_id", Integer, ForeignKey("permissions.id", ondelete="CASCADE"), primary_key=True),
)

user_roles = Table(
    "user_roles",
    Base.metadata,
    Column("user_id", GUID, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("role_id", Integer, ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True),
)

class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    description = Column(String(255), nullable=True)
    is_system = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    permissions = relationship("Permission", secondary=role_permissions, back_populates="roles", lazy="selectin")
    users = relationship("User", secondary=user_roles, back_populates="roles")

class Permission(Base):
    __tablename__ = "permissions"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(String(255), nullable=True)
    category = Column(String(50), nullable=False)

    roles = relationship("Role", secondary=role_permissions, back_populates="permissions")
