from datetime import datetime, date
from typing import Optional, Dict, Any
from uuid import UUID
from pydantic import BaseModel

class DesignationBase(BaseModel):
    title_hi: str
    title_en: str
    display_order: int = 0

class DesignationCreate(DesignationBase):
    pass

class DesignationOut(DesignationBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class CommitteeMemberBase(BaseModel):
    full_name: str
    mobile: str
    email: Optional[str] = None
    address: Optional[str] = None
    designation_id: Optional[int] = None
    custom_designation: Optional[str] = None
    joining_date: date = date.today()
    bio: Optional[str] = None
    profile_photo_url: Optional[str] = None
    social_links: Optional[Dict[str, Any]] = {}
    is_active: bool = True
    display_order: int = 0

class CommitteeMemberCreate(CommitteeMemberBase):
    pass

class CommitteeMemberUpdate(BaseModel):
    full_name: Optional[str] = None
    mobile: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    designation_id: Optional[int] = None
    custom_designation: Optional[str] = None
    joining_date: Optional[date] = None
    bio: Optional[str] = None
    profile_photo_url: Optional[str] = None
    social_links: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None
    display_order: Optional[int] = None

class CommitteeMemberOut(CommitteeMemberBase):
    id: UUID
    designation: Optional[DesignationOut] = None
    created_at: datetime
    class Config:
        from_attributes = True

# Public schema (masks sensitive member address/phone if needed)
class CommitteeMemberPublicOut(BaseModel):
    id: UUID
    full_name: str
    designation_title_hi: Optional[str] = None
    designation_title_en: Optional[str] = None
    custom_designation: Optional[str] = None
    profile_photo_url: Optional[str] = None
    bio: Optional[str] = None
    display_order: int = 0
    social_links: Optional[Dict[str, Any]] = {}
    class Config:
        from_attributes = True
