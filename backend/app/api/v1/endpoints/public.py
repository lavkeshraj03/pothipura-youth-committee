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

@router.get("/donations/all")
async def get_all_verified_donations(db: AsyncSession = Depends(get_db)):
    """
    Returns full verified donation list with receipts for live public frontend sync.
    """
    stmt = (
        select(Donation)
        .where(Donation.status == "VERIFIED")
        .order_by(desc(Donation.created_at))
    )
    res = await db.execute(stmt)
    donations = res.scalars().all()
    results = []
    for d in donations:
        receipt_no = d.receipt.receipt_number if d.receipt else f"PYC-{str(d.id)[:6].upper()}"
        results.append({
            "id": receipt_no,
            "name": d.donor.full_name if d.donor else "धर्मप्रेमी दानदाता",
            "location": d.donor.address if (d.donor and d.donor.address) else "पोथी का नगला",
            "amount": float(d.amount),
            "phone": d.donor.mobile if d.donor else "",
            "utr": d.transaction_ref or "CASH",
            "collector": d.collected_by.full_name if d.collected_by else "पोथीपुरा युवा समिति",
            "date": d.created_at.strftime("%Y-%m-%d") if d.created_at else "",
            "verified": True
        })
    return results

@router.get("/donations/pending-all")
async def get_all_pending_donations(db: AsyncSession = Depends(get_db)):
    """
    Returns all pending online donations for the admin verification queue.
    """
    stmt = (
        select(Donation)
        .where(Donation.status == "PENDING")
        .order_by(desc(Donation.created_at))
    )
    res = await db.execute(stmt)
    donations = res.scalars().all()
    results = []
    for d in donations:
        results.append({
            "id": str(d.id),
            "name": d.donor.full_name if d.donor else "ऑनलाइन दानदाता",
            "location": d.donor.address if (d.donor and d.donor.address) else "ऑनलाइन",
            "amount": float(d.amount),
            "phone": d.donor.mobile if d.donor else "",
            "utr": d.transaction_ref or "UPI-ONLINE",
            "mode": "ऑनलाइन UPI QR",
            "date": d.created_at.strftime("%Y-%m-%d") if d.created_at else ""
        })
    return results

@router.post("/donations/approve")
async def approve_donation_direct(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Approves a pending donation, marks it VERIFIED, and generates receipt.
    """
    data = await request.json()
    raw_id = data.get("id")
    if not raw_id:
        raise HTTPException(status_code=400, detail="Donation ID is required")
    
    # Check if UUID or partial
    stmt = select(Donation).where(Donation.id == raw_id) if len(str(raw_id)) == 36 else select(Donation)
    res = await db.execute(stmt)
    donations = res.scalars().all()
    
    donation = None
    for d in donations:
        if str(d.id) == str(raw_id) or str(d.id).endswith(str(raw_id)) or str(raw_id) in str(d.id):
            donation = d
            break
            
    if not donation:
        raise HTTPException(status_code=404, detail="Donation record not found")
        
    donation.status = "VERIFIED"
    donation.verified_at = datetime.utcnow()
    await db.flush()
    
    if not donation.receipt:
        await donation_service.create_receipt_for_donation(db, donation)
        
    await db.commit()
    await db.refresh(donation)
    
    receipt_no = donation.receipt.receipt_number if donation.receipt else f"PYC-{str(donation.id)[:6].upper()}"
    return {
        "success": True,
        "id": receipt_no,
        "name": donation.donor.full_name if donation.donor else "दानदाता",
        "amount": float(donation.amount),
        "utr": donation.transaction_ref or "VERIFIED-UPI",
        "collector": "ऑनलाइन गेटवे (सत्यापित: सुपर एडमिन)"
    }

@router.post("/donations/direct")
async def add_direct_donation_sync(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Adds a verified direct donation (Cash / QR) into the central database.
    """
    data = await request.json()
    name = str(data.get("name", "")).strip()
    amount_raw = data.get("amount", 0)
    location = str(data.get("location", "पोथी का नगला")).strip()
    phone = str(data.get("phone", "")).strip()
    collector = str(data.get("collector", "पोथीपुरा युवा समिति")).strip()
    mode = str(data.get("mode", "नकद (Cash)")).strip()
    utr = str(data.get("utr", "")).strip()
    
    if not name or not amount_raw:
        raise HTTPException(status_code=400, detail="Name and Amount are required")
        
    amount = Decimal(str(amount_raw))
    
    donor = await donation_service.get_or_create_donor(
        db=db,
        full_name=name,
        mobile=phone or "9800000000",
        address=location
    )
    
    donation = Donation(
        donor_id=donor.id,
        amount=amount,
        purpose="श्री कृष्ण जन्माष्टमी एवं खेलकूद महोत्सव 2026",
        payment_method="CASH" if "नकद" in mode or "Cash" in mode else "UPI_ONLINE",
        transaction_ref=utr or f"CASH-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
        status="VERIFIED",
        is_anonymous=False,
        verified_at=datetime.utcnow()
    )
    db.add(donation)
    await db.flush()
    
    receipt = await donation_service.create_receipt_for_donation(db, donation)
    await db.commit()
    await db.refresh(donation)
    
    receipt_no = receipt.receipt_number if receipt else f"PYC-{str(donation.id)[:6].upper()}"
    return {
        "success": True,
        "id": receipt_no,
        "name": name,
        "location": location,
        "amount": float(amount),
        "phone": phone,
        "utr": donation.transaction_ref,
        "collector": collector,
        "date": donation.created_at.strftime("%Y-%m-%d") if donation.created_at else "",
        "verified": True
    }

@router.post("/donations/delete-any")
async def delete_donation_sync(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Deletes any donation by ID from the central database.
    """
    data = await request.json()
    raw_id = data.get("id")
    if not raw_id:
        raise HTTPException(status_code=400, detail="ID is required")
        
    stmt = select(Donation)
    res = await db.execute(stmt)
    donations = res.scalars().all()
    
    target = None
    for d in donations:
        r_num = d.receipt.receipt_number if d.receipt else ""
        if str(d.id) == str(raw_id) or str(d.id).endswith(str(raw_id)) or r_num == str(raw_id):
            target = d
            break
            
    if target:
        await db.delete(target)
        await db.commit()
        return {"success": True, "message": "Donation deleted from database"}
    return {"success": False, "message": "Not found in database, cleared from cache"}

@router.get("/expenses/all")
async def get_all_expenses_sync(db: AsyncSession = Depends(get_db)):
    """
    Returns all approved expenses for transparency sync.
    """
    stmt = select(Expense).order_by(desc(Expense.created_at))
    res = await db.execute(stmt)
    expenses = res.scalars().all()
    results = []
    for exp in expenses:
        results.append({
            "id": f"EXP-{str(exp.id)[:6].upper()}",
            "head": exp.description or (exp.category.name_hi if exp.category else "महोत्सव व्यवस्था व्यय"),
            "member": exp.committee_member.full_name if exp.committee_member else "पोथीपुरा युवा समिति",
            "vendor": exp.vendor_name or "स्थानीय आपूर्तिकर्ता",
            "amount": float(exp.amount),
            "billNo": exp.bill_number or "VOUCH",
            "date": exp.expense_date.strftime("%Y-%m-%d") if exp.expense_date else ""
        })
    return results

@router.post("/expenses/add")
async def add_expense_sync(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Adds an expense into the central database.
    """
    data = await request.json()
    head = str(data.get("head", "")).strip()
    amount_raw = data.get("amount", 0)
    member = str(data.get("member", "पोथीपुरा युवा समिति")).strip()
    vendor = str(data.get("vendor", "स्थानीय आपूर्तिकर्ता")).strip()
    billNo = str(data.get("billNo", "VOUCH")).strip()
    
    if not head or not amount_raw:
        raise HTTPException(status_code=400, detail="Head and Amount are required")
        
    amount = Decimal(str(amount_raw))
    
    # Default category
    cat_stmt = select(ExpenseCategory).limit(1)
    cat_res = await db.execute(cat_stmt)
    cat = cat_res.scalar_one_or_none()
    
    expense = Expense(
        category_id=cat.id if cat else None,
        amount=amount,
        description=head,
        vendor_name=vendor,
        bill_number=billNo,
        expense_date=datetime.utcnow(),
        payment_method="CASH",
        status="APPROVED",
        is_public_disclosed=True
    )
    db.add(expense)
    await db.commit()
    await db.refresh(expense)
    
    return {
        "success": True,
        "id": f"EXP-{str(expense.id)[:6].upper()}",
        "head": head,
        "member": member,
        "vendor": vendor,
        "amount": float(amount),
        "billNo": billNo,
        "date": expense.created_at.strftime("%Y-%m-%d") if expense.created_at else ""
    }

@router.post("/expenses/delete")
async def delete_expense_sync(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Deletes an expense from the central database.
    """
    data = await request.json()
    raw_id = data.get("id")
    if not raw_id:
        raise HTTPException(status_code=400, detail="ID is required")
        
    stmt = select(Expense)
    res = await db.execute(stmt)
    expenses = res.scalars().all()
    
    target = None
    for e in expenses:
        exp_code = f"EXP-{str(e.id)[:6].upper()}"
        if str(e.id) == str(raw_id) or str(e.id).endswith(str(raw_id)) or exp_code == str(raw_id):
            target = e
            break
            
    if target:
        await db.delete(target)
        await db.commit()
        return {"success": True, "message": "Expense deleted"}
    return {"success": False, "message": "Not found in database"}



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
