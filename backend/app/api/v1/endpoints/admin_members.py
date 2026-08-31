from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.committee import CommitteeMember, Designation
from app.schemas.committee import (
    CommitteeMemberOut, CommitteeMemberCreate, CommitteeMemberUpdate,
    DesignationOut, DesignationCreate
)
from app.services.audit_service import log_action

router = APIRouter()

@router.get("/designations", response_model=List[DesignationOut])
async def list_designations(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    stmt = select(Designation).order_by(Designation.display_order)
    res = await db.execute(stmt)
    return res.scalars().all()

@router.post("/designations", response_model=DesignationOut)
async def create_designation(req: DesignationCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    des = Designation(title_hi=req.title_hi, title_en=req.title_en, display_order=req.display_order)
    db.add(des)
    await db.commit()
    await db.refresh(des)
    return des

@router.get("", response_model=List[CommitteeMemberOut])
async def list_members(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    stmt = select(CommitteeMember).order_by(CommitteeMember.display_order)
    res = await db.execute(stmt)
    return res.scalars().all()

@router.post("", response_model=CommitteeMemberOut)
async def create_member(req: CommitteeMemberCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    member = CommitteeMember(
        full_name=req.full_name,
        mobile=req.mobile,
        email=req.email,
        address=req.address,
        designation_id=req.designation_id,
        custom_designation=req.custom_designation,
        joining_date=req.joining_date,
        bio=req.bio,
        profile_photo_url=req.profile_photo_url,
        social_links=req.social_links or {},
        is_active=req.is_active,
        display_order=req.display_order
    )
    db.add(member)
    await db.commit()
    await db.refresh(member)
    return member

@router.put("/{id}", response_model=CommitteeMemberOut)
async def update_member(id: UUID, req: CommitteeMemberUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    stmt = select(CommitteeMember).where(CommitteeMember.id == id)
    res = await db.execute(stmt)
    member = res.scalar_one_or_none()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    for k, v in req.dict(exclude_unset=True).items():
        setattr(member, k, v)

    await db.commit()
    await db.refresh(member)
    return member

@router.delete("/{id}")
async def delete_member(id: UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    stmt = select(CommitteeMember).where(CommitteeMember.id == id)
    res = await db.execute(stmt)
    member = res.scalar_one_or_none()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    member.is_active = False  # Safe soft-delete
    await db.commit()
    return {"message": "Member archived successfully"}
