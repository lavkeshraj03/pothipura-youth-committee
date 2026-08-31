import uuid
import hashlib
from datetime import datetime
from decimal import Decimal
from typing import Optional
from io import BytesIO
import base64
import qrcode
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.donation import Donor, Donation, DonationReceipt
from app.models.event import Event
from app.models.settings import SiteSetting
from app.services.receipt_service import receipt_service
from app.services.notification_service import notification_service
from app.services.audit_service import log_action

class DonationService:
    @staticmethod
    async def get_or_create_donor(
        db: AsyncSession,
        full_name: str,
        mobile: str,
        email: Optional[str] = None,
        address: Optional[str] = None,
        is_anonymous_by_default: bool = False
    ) -> Donor:
        stmt = select(Donor).where(Donor.mobile == mobile.strip())
        res = await db.execute(stmt)
        donor = res.scalar_one_or_none()
        if not donor:
            donor = Donor(
                full_name=full_name.strip(),
                mobile=mobile.strip(),
                email=email.strip() if email else None,
                address=address.strip() if address else None,
                is_anonymous_by_default=is_anonymous_by_default
            )
            db.add(donor)
            await db.flush()
        else:
            # Update name/email if provided
            if full_name and not donor.full_name:
                donor.full_name = full_name.strip()
            if email and not donor.email:
                donor.email = email.strip()
            await db.flush()
        return donor

    @staticmethod
    async def get_next_receipt_number(db: AsyncSession) -> str:
        current_year = datetime.utcnow().year
        stmt = select(func.count(DonationReceipt.id))
        res = await db.execute(stmt)
        count = res.scalar() or 0
        return f"YOUTH-{current_year}-{(count + 1):06d}"

    @staticmethod
    async def get_configured_upi_settings(db: AsyncSession) -> dict:
        stmt = select(SiteSetting).where(SiteSetting.key == "upi_settings")
        res = await db.execute(stmt)
        setting = res.scalar_one_or_none()
        if setting and isinstance(setting.value, dict):
            return setting.value
        return {
            "upi_id": "youthcommittee@upi",
            "payee_name": "Gram Yuva Samiti",
            "donation_note": "Janmashtami Mahotsav Donation"
        }

    @staticmethod
    def generate_upi_qr_data_uri(upi_uri: str) -> str:
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=6,
            border=2,
        )
        qr.add_data(upi_uri)
        qr.make(fit=True)
        img = qr.make_image(fill_color="#0B1D3A", back_color="white")
        buffered = BytesIO()
        img.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        return f"data:image/png;base64,{img_str}"

    @staticmethod
    async def create_receipt_for_donation(db: AsyncSession, donation: Donation) -> DonationReceipt:
        receipt_num = await DonationService.get_next_receipt_number(db)
        download_hash = hashlib.sha256(f"{donation.id}-{receipt_num}-{datetime.utcnow().isoformat()}".encode()).hexdigest()
        
        pdf_filename = receipt_service.generate_receipt_pdf(
            receipt_number=receipt_num,
            donor_name="Anonymous Donor" if donation.is_anonymous else donation.donor.full_name,
            donor_mobile=donation.donor.mobile,
            amount=float(donation.amount),
            purpose=donation.purpose,
            payment_method=donation.payment_method,
            transaction_ref=donation.transaction_ref or "CASH",
            issued_at=datetime.utcnow(),
            download_hash=download_hash
        )

        receipt = DonationReceipt(
            donation_id=donation.id,
            receipt_number=receipt_num,
            pdf_file_path=pdf_filename,
            download_hash=download_hash
        )
        db.add(receipt)
        await db.flush()

        # Send notification
        download_url = f"/api/v1/public/receipts/{download_hash}"
        await notification_service.send_donation_receipt_notification(
            mobile=donation.donor.mobile,
            email=donation.donor.email,
            donor_name=donation.donor.full_name,
            amount=float(donation.amount),
            receipt_number=receipt_num,
            download_url=download_url
        )

        return receipt

donation_service = DonationService()
