from datetime import datetime
from typing import Optional, List
from uuid import UUID
from decimal import Decimal
from pydantic import BaseModel

class EventProgramBase(BaseModel):
    time_label: str
    title_hi: str
    title_en: str
    description: Optional[str] = None
    display_order: int = 0

class EventProgramCreate(EventProgramBase):
    pass

class EventProgramOut(EventProgramBase):
    id: int
    event_id: UUID
    class Config:
        from_attributes = True

class EventBase(BaseModel):
    slug: str
    title_hi: str
    title_en: str
    event_type: str = "RELIGIOUS"
    description_hi: Optional[str] = None
    description_en: Optional[str] = None
    start_date: datetime
    end_date: datetime
    venue: str
    cover_image_url: Optional[str] = None
    poster_url: Optional[str] = None
    target_donation_amount: Decimal = Decimal("0.00")
    status: str = "UPCOMING"
    is_featured: bool = False

class EventCreate(EventBase):
    programs: List[EventProgramCreate] = []

class EventUpdate(BaseModel):
    title_hi: Optional[str] = None
    title_en: Optional[str] = None
    event_type: Optional[str] = None
    description_hi: Optional[str] = None
    description_en: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    venue: Optional[str] = None
    cover_image_url: Optional[str] = None
    poster_url: Optional[str] = None
    target_donation_amount: Optional[Decimal] = None
    status: Optional[str] = None
    is_featured: Optional[bool] = None

class EventOut(EventBase):
    id: UUID
    programs: List[EventProgramOut] = []
    created_at: datetime
    class Config:
        from_attributes = True
