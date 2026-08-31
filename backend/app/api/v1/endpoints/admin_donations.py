from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.db.session import get_db
from app.api.deps import get_current_user, require_permissions
from app.models.user import User
from app.models.donation import Donation, Donor, DonationReceipt
from app.schemas.donation import (
    DonationAdminOut, CashDonationCreate, DonationVerifyRequest
)
from app.services.donation_service import donation_service
from app.services.audit_service import log_action

router = APIRouter()

@router.get("", response_model=List[DonationAdminOut])
async def list_donations(
    status_filter: Optional[str] = None,
    payment_method: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(Donation).order_by(desc(Donation.created_at))
    if status_filter:
        stmt = stmt.where(Donation.status == status_filter)
    if payment_method:
        stmt = stmt.where(Donation.payment_method == payment_method)
    
    res = await db.execute(stmt.offset(offset).limit(limit))
    donations = res.scalars().all()

    results = []
    for d in donations:
        receipt_url = None
        receipt_num = None
        if d.receipt:
            receipt_num = d.receipt.receipt_number
            receipt_url = f"/api/v1/public/receipts/{d.receipt.download_hash}"

        results.append(DonationAdminOut(
            id=d.id,
            amount=d.amount,
            purpose=d.purpose,
            payment_method=d.payment_method,
            transaction_ref=d.transaction_ref,
            status=d.status,
            is_anonymous=d.is_anonymous,
            donor_message=d.donor_message,
            donor_name=d.donor.full_name,
            donor_mobile=d.donor.mobile,
            donor_email=d.donor.email,
            event_title=d.event.title_hi if d.event else None,
            receipt_number=receipt_num,
            receipt_download_url=receipt_url,
            collected_by_name=d.collected_by.full_name if d.collected_by else None,
            verified_by_name=d.verified_by.full_name if d.verified_by else None,
            verified_at=d.verified_at,
            created_at=d.created_at
        ))
    return results

@router.post("/cash", response_model=DonationAdminOut)
async def add_cash_donation(
    req: CashDonationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Physical Cash Collection flow by committee member.
    Creates donor, creates VERIFIED cash donation, generates official PDF receipt immediately.
    """
    if req.amount <= Decimal("0"):
        raise HTTPException(status_code=400, detail="Amount must be greater than zero")

    donor = await donation_service.get_or_create_donor(
        db=db,
        full_name=req.donor_name,
        mobile=req.donor_mobile,
        email=req.donor_email,
        address=req.donor_address,
        is_anonymous_by_default=req.is_anonymous
    )

    donation = Donation(
        donor_id=donor.id,
        event_id=req.event_id,
        amount=req.amount,
        purpose=req.purpose,
        payment_method="CASH",
        transaction_ref=req.transaction_ref or f"CASH-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
        status="VERIFIED",
        is_anonymous=req.is_anonymous,
        donor_message=req.donor_message,
        collected_by_user_id=current_user.id,
        verified_by_user_id=current_user.id,
        verified_at=datetime.utcnow(),
        collected_at=datetime.utcnow()
    )
    db.add(donation)
    await db.flush()

    # Generate Receipt
    receipt = await donation_service.create_receipt_for_donation(db, donation)
    
    # Audit Log
    await log_action(
        db=db,
        action="CASH_DONATION_CREATE",
        entity="donations",
        entity_id=str(donation.id),
        user_id=current_user.id,
        new_values={
            "amount": float(donation.amount),
            "donor": donor.full_name,
            "receipt_number": receipt.receipt_number
        }
    )

    await db.commit()
    await db.refresh(donation)

    return DonationAdminOut(
        id=donation.id,
        amount=donation.amount,
        purpose=donation.purpose,
        payment_method=donation.payment_method,
        transaction_ref=donation.transaction_ref,
        status=donation.status,
        is_anonymous=donation.is_anonymous,
        donor_message=donation.donor_message,
        donor_name=donor.full_name,
        donor_mobile=donor.mobile,
        donor_email=donor.email,
        event_title=donation.event.title_hi if donation.event else None,
        receipt_number=receipt.receipt_number,
        receipt_download_url=f"/api/v1/public/receipts/{receipt.download_hash}",
        collected_by_name=current_user.full_name,
        verified_by_name=current_user.full_name,
        verified_at=donation.verified_at,
        created_at=donation.created_at
    )

@router.patch("/{id}/verify", response_model=DonationAdminOut)
async def verify_donation(
    id: UUID,
    req: DonationVerifyRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Verify or Reject an online UPI donation.
    If VERIFIED: Generates official PDF receipt and dispatches notification.
    """
    stmt = select(Donation).where(Donation.id == id)
    res = await db.execute(stmt)
    donation = res.scalar_one_or_none()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation record not found")

    old_status = donation.status
    if req.status == "VERIFIED":
        donation.status = "VERIFIED"
        donation.verified_by_user_id = current_user.id
        donation.verified_at = datetime.utcnow()
        await db.flush()

        # Generate receipt if not already generated
        if not donation.receipt:
            await donation_service.create_receipt_for_donation(db, donation)
    elif req.status == "REJECTED":
        donation.status = "REJECTED"
        donation.rejection_reason = req.rejection_reason
        donation.verified_by_user_id = current_user.id
        donation.verified_at = datetime.utcnow()

    # Log to Audit Trail
    await log_action(
        db=db,
        action=f"DONATION_{req.status}",
        entity="donations",
        entity_id=str(donation.id),
        user_id=current_user.id,
        old_values={"status": old_status},
        new_values={"status": donation.status, "reason": req.rejection_reason}
    )

    await db.commit()
    await db.refresh(donation)

    receipt_num = donation.receipt.receipt_number if donation.receipt else None
    receipt_url = f"/api/v1/public/receipts/{donation.receipt.download_hash}" if donation.receipt else None

    return DonationAdminOut(
        id=donation.id,
        amount=donation.amount,
        purpose=donation.purpose,
        payment_method=donation.payment_method,
        transaction_ref=donation.transaction_ref,
        status=donation.status,
        is_anonymous=donation.is_anonymous,
        donor_message=donation.donor_message,
        donor_name=donation.donor.full_name,
        donor_mobile=donation.donor.mobile,
        donor_email=donation.donor.email,
        event_title=donation.event.title_hi if donation.event else None,
        receipt_number=receipt_num,
        receipt_download_url=receipt_url,
        collected_by_name=donation.collected_by.full_name if donation.collected_by else None,
        verified_by_name=current_user.full_name,
        verified_at=donation.verified_at,
        created_at=donation.created_at
    )
