import os
import urllib.parse
from decimal import Decimal
from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.core.config import settings
from app.db.session import get_db
from app.models.committee import CommitteeMember, Designation
from app.models.event import Event, EventProgram
from app.models.announcement import Announcement, Poster
from app.models.donation import Donation, Donor, DonationReceipt
from app.models.expense import Expense, ExpenseCategory
from app.models.education import EducationProgram, StudentApplication
from app.schemas.committee import CommitteeMemberPublicOut
from app.schemas.event import EventOut
from app.schemas.announcement import AnnouncementOut, PosterOut
from app.schemas.donation import (
    PublicDonorOut, DonationInitiateRequest, DonationInitiateResponse,
    DonationConfirmRequest
)
from app.schemas.expense import PublicExpenseOut
from app.schemas.education import StudentApplicationCreate
from app.schemas.settings import TransparencySummaryOut
from app.services.donation_service import donation_service
from app.services.transparency_service import transparency_service

router = APIRouter()

@router.get("/janmashtami")
async def get_janmashtami_bundle(db: AsyncSession = Depends(get_db)):
    """
    Returns full festival bundle for Shree Krishna Janmashtami (4 September 2026):
    Event info, schedule programs, announcements, committee highlights, transparency snapshot.
    """
    # 1. Fetch Janmashtami Event
    stmt = select(Event).where(Event.slug == "janmashtami-2026")
    res = await db.execute(stmt)
    event = res.scalar_one_or_none()

    if not event:
        # Fallback to any featured event
        stmt2 = select(Event).where(Event.is_featured == True)
        res2 = await db.execute(stmt2)
        event = res2.scalar_one_or_none()

    # 2. Announcements
    ann_stmt = select(Announcement).where(Announcement.is_published == True).order_by(desc(Announcement.publish_at)).limit(5)
    ann_res = await db.execute(ann_stmt)
    announcements = ann_res.scalars().all()

    # 3. Posters
    post_stmt = select(Poster).where(Poster.is_active == True).order_by(Poster.display_order)
    post_res = await db.execute(post_stmt)
    posters = post_res.scalars().all()

    # 4. Committee Leadership Roster
    comm_stmt = (
        select(CommitteeMember)
        .where(CommitteeMember.is_active == True)
        .order_by(CommitteeMember.display_order)
        .limit(8)
    )
    comm_res = await db.execute(comm_stmt)
    members = comm_res.scalars().all()

    committee_data = []
    for m in members:
        committee_data.append({
            "id": str(m.id),
            "full_name": m.full_name,
            "designation_title_hi": m.designation.title_hi if m.designation else m.custom_designation or "सदस्य",
            "designation_title_en": m.designation.title_en if m.designation else m.custom_designation or "Member",
            "profile_photo_url": m.profile_photo_url,
            "bio": m.bio,
            "display_order": m.display_order
        })

    # 5. Transparency Summary
    transparency = await transparency_service.get_summary(db)

    # 6. UPI Settings
    upi_settings = await donation_service.get_configured_upi_settings(db)

    return {
        "event": event,
        "announcements": announcements,
        "posters": posters,
        "committee_members": committee_data,
        "transparency": transparency,
        "upi_settings": upi_settings
    }

@router.get("/committee", response_model=List[CommitteeMemberPublicOut])
async def get_public_committee(db: AsyncSession = Depends(get_db)):
    stmt = (
        select(CommitteeMember)
        .where(CommitteeMember.is_active == True)
        .order_by(CommitteeMember.display_order)
    )
    res = await db.execute(stmt)
    members = res.scalars().all()

    results = []
    for m in members:
        results.append(CommitteeMemberPublicOut(
            id=m.id,
            full_name=m.full_name,
            designation_title_hi=m.designation.title_hi if m.designation else m.custom_designation,
            designation_title_en=m.designation.title_en if m.designation else m.custom_designation,
            custom_designation=m.custom_designation,
            profile_photo_url=m.profile_photo_url,
            bio=m.bio,
            display_order=m.display_order,
            social_links=m.social_links or {}
        ))
    return results

@router.get("/events", response_model=List[EventOut])
async def get_public_events(db: AsyncSession = Depends(get_db)):
    stmt = select(Event).order_by(Event.start_date)
    res = await db.execute(stmt)
    return res.scalars().all()

@router.get("/events/{slug}", response_model=EventOut)
async def get_public_event_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Event).where(Event.slug == slug)
    res = await db.execute(stmt)
    event = res.scalar_one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.get("/announcements", response_model=List[AnnouncementOut])
async def get_public_announcements(db: AsyncSession = Depends(get_db)):
    stmt = select(Announcement).where(Announcement.is_published == True).order_by(desc(Announcement.publish_at))
    res = await db.execute(stmt)
    return res.scalars().all()

@router.get("/posters", response_model=List[PosterOut])
async def get_public_posters(db: AsyncSession = Depends(get_db)):
    stmt = select(Poster).where(Poster.is_active == True).order_by(Poster.display_order)
    res = await db.execute(stmt)
    return res.scalars().all()

@router.get("/donors", response_model=List[PublicDonorOut])
async def get_public_donors(db: AsyncSession = Depends(get_db)):
    """
    Public Donor Wall: Only verified donations are shown.
    Privacy rules enforced: If is_anonymous is True, name is masked as 'गुप्त दानदाता (Anonymous)'.
    Personal contact info (mobile, email, address) is NEVER returned.
    """
    stmt = (
        select(Donation)
        .where(Donation.status == "VERIFIED")
        .order_by(desc(Donation.created_at))
        .limit(100)
    )
    res = await db.execute(stmt)
    donations = res.scalars().all()

    donors_out = []
    for d in donations:
        name = "गुप्त दानदाता (Anonymous)" if (d.is_anonymous or d.donor.is_anonymous_by_default) else d.donor.full_name
        donors_out.append(PublicDonorOut(
            display_name=name,
            amount=d.amount,
            purpose=d.purpose,
            donated_at=d.created_at,
            is_anonymous=d.is_anonymous or d.donor.is_anonymous_by_default
        ))
    return donors_out

@router.get("/transparency", response_model=TransparencySummaryOut)
async def get_public_transparency(db: AsyncSession = Depends(get_db)):
    return await transparency_service.get_summary(db)

@router.get("/transparency/expenses", response_model=List[PublicExpenseOut])
async def get_public_expenses(db: AsyncSession = Depends(get_db)):
    stmt = (
        select(Expense)
        .where((Expense.status == "APPROVED") & (Expense.is_public_disclosed == True))
        .order_by(desc(Expense.expense_date))
    )
    res = await db.execute(stmt)
    expenses = res.scalars().all()

    results = []
    for exp in expenses:
        results.append(PublicExpenseOut(
            id=exp.id,
            category_name_hi=exp.category.name_hi,
            category_name_en=exp.category.name_en,
            amount=exp.amount,
            description=exp.description,
            committee_member_name=exp.committee_member.full_name if exp.committee_member else None,
            expense_date=exp.expense_date,
            event_title=exp.event.title_hi if exp.event else None
        ))
    return results

@router.post("/donations/initiate", response_model=DonationInitiateResponse)
async def initiate_donation(req: DonationInitiateRequest, db: AsyncSession = Depends(get_db)):
    """
    Step 1 of Online UPI flow:
    Registers donor & creates PENDING donation. Returns dynamic UPI deep link + QR code Data URI.
    """
    if req.amount <= Decimal("0"):
        raise HTTPException(status_code=400, detail="Donation amount must be greater than zero")

    donor = await donation_service.get_or_create_donor(
        db=db,
        full_name=req.full_name,
        mobile=req.mobile,
        email=req.email,
        is_anonymous_by_default=req.is_anonymous
    )

    donation = Donation(
        donor_id=donor.id,
        event_id=req.event_id,
        amount=req.amount,
        purpose=req.purpose,
        payment_method="UPI_ONLINE",
        status="PENDING",
        is_anonymous=req.is_anonymous,
        donor_message=req.donor_message
    )
    db.add(donation)
    await db.commit()
    await db.refresh(donation)

    # Fetch UPI configuration
    upi_settings = await donation_service.get_configured_upi_settings(db)
    upi_id = upi_settings.get("upi_id", "youthcommittee@upi")
    payee_name = upi_settings.get("payee_name", "Gram Yuva Samiti")
    note = f"Donation {req.purpose} - {str(donation.id)[:8]}"

    # Standard UPI URI Scheme
    encoded_note = urllib.parse.quote(note)
    encoded_name = urllib.parse.quote(payee_name)
    upi_uri = f"upi://pay?pa={upi_id}&pn={encoded_name}&am={float(req.amount):.2f}&cu=INR&tn={encoded_note}"
    qr_data_uri = donation_service.generate_upi_qr_data_uri(upi_uri)

    return DonationInitiateResponse(
        donation_id=donation.id,
        amount=req.amount,
        upi_id=upi_id,
        upi_payee_name=payee_name,
        upi_intent_uri=upi_uri,
        qr_code_data_uri=qr_data_uri,
        reference_code=str(donation.id)[:8].upper(),
        instructions="कृपया UPI ऐप (GPay / PhonePe / Paytm / BHIM) से भुगतान करने के बाद UTR / Transaction Reference Number सबमिट करें।"
    )

@router.post("/donations/confirm")
async def confirm_donation_payment(req: DonationConfirmRequest, db: AsyncSession = Depends(get_db)):
    """
    Step 2 of Online UPI flow:
    Donor submits UTR / Reference number after payment. Status updates to PAYMENT_SUBMITTED.
    """
    stmt = select(Donation).where(Donation.id == req.donation_id)
    res = await db.execute(stmt)
    donation = res.scalar_one_or_none()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation record not found")

    donation.transaction_ref = req.transaction_ref.strip()
    donation.status = "PAYMENT_SUBMITTED"
    if req.notes:
        donation.donor_message = (donation.donor_message or "") + f" [Note: {req.notes}]"

    await db.commit()
    return {
        "message": "भुगतान विवरण सफलतापूर्वक प्राप्त हुआ। समिति द्वारा सत्यापन के बाद आपकी डिजिटल रसीद जारी कर दी जाएगी।",
        "donation_id": str(donation.id),
        "status": donation.status
    }

@router.get("/receipts/{download_hash}")
async def download_receipt_by_hash(download_hash: str, db: AsyncSession = Depends(get_db)):
    """
    Public PDF Receipt Download (Tamper-proof SHA-256 hash).
    """
    stmt = select(DonationReceipt).where(DonationReceipt.download_hash == download_hash)
    res = await db.execute(stmt)
    receipt = res.scalar_one_or_none()
    if not receipt or not receipt.is_active:
        raise HTTPException(status_code=404, detail="Receipt not found or expired")

    file_path = os.path.join(settings.RECEIPT_DIR, receipt.pdf_file_path)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Receipt PDF file not found on disk")

    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename=f"Donation_Receipt_{receipt.receipt_number}.pdf"
    )

@router.post("/education/apply")
async def apply_education_support(req: StudentApplicationCreate, db: AsyncSession = Depends(get_db)):
    """
    Public application submission for IIT-JEE / NEET / Competitive Exam Coaching Support.
    """
    application = StudentApplication(
        program_id=req.program_id,
        student_name=req.student_name.strip(),
        parent_guardian_name=req.parent_guardian_name.strip(),
        mobile=req.mobile.strip(),
        email=req.email.strip() if req.email else None,
        village_name=req.village_name.strip(),
        current_class_or_year=req.current_class_or_year.strip(),
        school_or_college=req.school_or_college.strip(),
        target_examination=req.target_examination.strip(),
        academic_performance=req.academic_performance.strip(),
        annual_family_income_range=req.annual_family_income_range.strip(),
        reason_for_support=req.reason_for_support.strip(),
        coaching_requirement=req.coaching_requirement.strip(),
        status="SUBMITTED"
    )
    db.add(application)
    await db.commit()
    await db.refresh(application)
    return {
        "message": "आपका आवेदन सफलतापूर्वक प्राप्त हो गया है। समिति जल्द ही आपसे संपर्क करेगी।",
        "application_id": str(application.id)
    }

@router.post("/contact")
async def submit_contact_inquiry(request: Request):
    data = await request.json()
    # In dev/MVP, log contact inquiry
    return {
        "message": "धन्यवाद! आपका संदेश ग्राम युवा समिति को प्राप्त हो गया है।"
    }
