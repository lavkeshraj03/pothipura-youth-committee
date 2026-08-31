from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.event import Event, EventProgram
from app.schemas.event import EventOut, EventCreate, EventUpdate, EventProgramCreate, EventProgramOut

router = APIRouter()

@router.get("", response_model=List[EventOut])
async def list_events(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    stmt = select(Event).order_by(Event.start_date)
    res = await db.execute(stmt)
    return res.scalars().all()

@router.post("", response_model=EventOut)
async def create_event(req: EventCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    event = Event(
        slug=req.slug,
        title_hi=req.title_hi,
        title_en=req.title_en,
        event_type=req.event_type,
        description_hi=req.description_hi,
        description_en=req.description_en,
        start_date=req.start_date,
        end_date=req.end_date,
        venue=req.venue,
        cover_image_url=req.cover_image_url,
        poster_url=req.poster_url,
        target_donation_amount=req.target_donation_amount,
        status=req.status,
        is_featured=req.is_featured
    )
    db.add(event)
    await db.flush()

    for p in req.programs:
        prog = EventProgram(
            event_id=event.id,
            time_label=p.time_label,
            title_hi=p.title_hi,
            title_en=p.title_en,
            description=p.description,
            display_order=p.display_order
        )
        db.add(prog)

    await db.commit()
    await db.refresh(event)
    return event

@router.post("/{event_id}/programs", response_model=EventProgramOut)
async def add_program_item(event_id: UUID, req: EventProgramCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    prog = EventProgram(
        event_id=event_id,
        time_label=req.time_label,
        title_hi=req.title_hi,
        title_en=req.title_en,
        description=req.description,
        display_order=req.display_order
    )
    db.add(prog)
    await db.commit()
    await db.refresh(prog)
    return prog
