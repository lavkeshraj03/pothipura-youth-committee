from datetime import datetime, date
from typing import Optional
from uuid import UUID
from pydantic import BaseModel

class AnnouncementBase(BaseModel):
    event_id: Optional[UUID] = None
    title_hi: str
    title_en: str
    description_hi: str
    description_en: str
    priority: str = "NORMAL"  # LOW, NORMAL, HIGH, CRITICAL
    image_url: Optional[str] = None
    is_published: bool = True
    publish_at: datetime = datetime.utcnow()

class AnnouncementCreate(AnnouncementBase):
    pass

class AnnouncementUpdate(BaseModel):
    event_id: Optional[UUID] = None
    title_hi: Optional[str] = None
    title_en: Optional[str] = None
    description_hi: Optional[str] = None
    description_en: Optional[str] = None
    priority: Optional[str] = None
    image_url: Optional[str] = None
    is_published: Optional[bool] = None
    publish_at: Optional[datetime] = None

class AnnouncementOut(AnnouncementBase):
    id: UUID
    created_at: datetime
    class Config:
        from_attributes = True

class PosterBase(BaseModel):
    event_id: Optional[UUID] = None
    title: str
    description: Optional[str] = None
    image_url: str
    display_order: int = 0
    is_active: bool = True
    expiry_date: Optional[date] = None

class PosterCreate(PosterBase):
    pass

class PosterOut(PosterBase):
    id: UUID
    created_at: datetime
    class Config:
        from_attributes = True
