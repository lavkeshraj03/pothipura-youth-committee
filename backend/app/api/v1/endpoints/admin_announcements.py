from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.announcement import Announcement, Poster
from app.schemas.announcement import AnnouncementOut, AnnouncementCreate, PosterOut, PosterCreate

router = APIRouter()

@router.get("", response_model=List[AnnouncementOut])
async def list_announcements(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    stmt = select(Announcement).order_by(desc(Announcement.publish_at))
    res = await db.execute(stmt)
    return res.scalars().all()

@router.post("", response_model=AnnouncementOut)
async def create_announcement(req: AnnouncementCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    ann = Announcement(
        event_id=req.event_id,
        title_hi=req.title_hi,
        title_en=req.title_en,
        description_hi=req.description_hi,
        description_en=req.description_en,
        priority=req.priority,
        image_url=req.image_url,
        is_published=req.is_published,
        publish_at=req.publish_at
    )
    db.add(ann)
    await db.commit()
    await db.refresh(ann)
    return ann

@router.get("/posters", response_model=List[PosterOut])
async def list_posters(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    stmt = select(Poster).order_by(Poster.display_order)
    res = await db.execute(stmt)
    return res.scalars().all()

@router.post("/posters", response_model=PosterOut)
async def create_poster(req: PosterCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    poster = Poster(
        event_id=req.event_id,
        title=req.title,
        description=req.description,
        image_url=req.image_url,
        display_order=req.display_order,
        is_active=req.is_active,
        expiry_date=req.expiry_date
    )
    db.add(poster)
    await db.commit()
    await db.refresh(poster)
    return poster
