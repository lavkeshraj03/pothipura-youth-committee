from datetime import datetime
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel

class GalleryItemBase(BaseModel):
    media_type: str = "IMAGE"
    media_url: str
    thumbnail_url: Optional[str] = None
    caption: Optional[str] = None
    is_featured: bool = False
    display_order: int = 0

class GalleryItemCreate(GalleryItemBase):
    album_id: UUID

class GalleryItemOut(GalleryItemBase):
    id: UUID
    album_id: UUID
    created_at: datetime
    class Config:
        from_attributes = True

class GalleryAlbumBase(BaseModel):
    event_id: Optional[UUID] = None
    title: str
    cover_image_url: Optional[str] = None

class GalleryAlbumCreate(GalleryAlbumBase):
    pass

class GalleryAlbumOut(GalleryAlbumBase):
    id: UUID
    items: List[GalleryItemOut] = []
    created_at: datetime
    class Config:
        from_attributes = True
