from datetime import datetime
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, EmailStr

class PermissionBase(BaseModel):
    code: str
    description: Optional[str] = None
    category: str

class PermissionOut(PermissionBase):
    id: int
    class Config:
        from_attributes = True

class RoleBase(BaseModel):
    name: str
    description: Optional[str] = None

class RoleOut(RoleBase):
    id: int
    is_system: bool
    permissions: List[PermissionOut] = []
    class Config:
        from_attributes = True

class UserBase(BaseModel):
    username: str
    email: EmailStr
    mobile: str
    full_name: str
    is_active: bool = True

class UserCreate(UserBase):
    password: str
    role_ids: List[int] = []

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    mobile: Optional[str] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = None
    password: Optional[str] = None
    role_ids: Optional[List[int]] = None

class UserOut(UserBase):
    id: UUID
    created_at: datetime
    roles: List[RoleOut] = []
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class LoginRequest(BaseModel):
    username_or_email: str
    password: str
