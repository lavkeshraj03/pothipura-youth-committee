from datetime import datetime
import uuid
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from app.db.base import GUID
from sqlalchemy.orm import relationship
from app.db.base import Base

class GalleryAlbum(Base):
    __tablename__ = "gallery_albums"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    event_id = Column(GUID, ForeignKey("events.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(150), nullable=False)
    cover_image_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    items = relationship("GalleryItem", back_populates="album", cascade="all, delete-orphan", lazy="selectin")

class GalleryItem(Base):
    __tablename__ = "gallery_items"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    album_id = Column(GUID, ForeignKey("gallery_albums.id", ondelete="CASCADE"), nullable=False)
    media_type = Column(String(20), default="IMAGE")  # IMAGE, VIDEO_LINK
    media_url = Column(String(255), nullable=False)
    thumbnail_url = Column(String(255), nullable=True)
    caption = Column(String(255), nullable=True)
    is_featured = Column(Boolean, default=False)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    album = relationship("GalleryAlbum", back_populates="items")
