from datetime import datetime
from typing import Optional
from uuid import UUID
from decimal import Decimal
from pydantic import BaseModel

class DonorBase(BaseModel):
    full_name: str
    mobile: str
    email: Optional[str] = None
    address: Optional[str] = None
    is_anonymous_by_default: bool = False
    notes: Optional[str] = None

class DonorCreate(DonorBase):
    pass

class DonorOut(DonorBase):
    id: UUID
    created_at: datetime
    total_donated: Optional[Decimal] = None
    donation_count: Optional[int] = None
    class Config:
        from_attributes = True

# Public Donor Schema (Strictly protects privacy)
class PublicDonorOut(BaseModel):
    display_name: str
    amount: Decimal
    purpose: str
    donated_at: datetime
    is_anonymous: bool

class DonationInitiateRequest(BaseModel):
    full_name: str
    mobile: str
    email: Optional[str] = None
    amount: Decimal
    purpose: str = "JANMASHTAMI"
    event_id: Optional[UUID] = None
    is_anonymous: bool = False
    donor_message: Optional[str] = None

class DonationInitiateResponse(BaseModel):
    donation_id: UUID
    amount: Decimal
    upi_id: str
    upi_payee_name: str
    upi_intent_uri: str
    qr_code_data_uri: str
    reference_code: str
    instructions: str

class DonationConfirmRequest(BaseModel):
    donation_id: UUID
    transaction_ref: str  # UTR / UPI Ref ID
    notes: Optional[str] = None

class CashDonationCreate(BaseModel):
    donor_name: str
    donor_mobile: str
    donor_email: Optional[str] = None
    donor_address: Optional[str] = None
    amount: Decimal
    purpose: str = "JANMASHTAMI"
    event_id: Optional[UUID] = None
    is_anonymous: bool = False
    transaction_ref: Optional[str] = None  # Voucher ID
    donor_message: Optional[str] = None
    notes: Optional[str] = None

class DonationVerifyRequest(BaseModel):
    status: str  # VERIFIED, REJECTED
    rejection_reason: Optional[str] = None

class DonationReceiptOut(BaseModel):
    id: UUID
    receipt_number: str
    issued_at: datetime
    download_url: str
    download_hash: str
    class Config:
        from_attributes = True

class DonationAdminOut(BaseModel):
    id: UUID
    amount: Decimal
    purpose: str
    payment_method: str
    transaction_ref: Optional[str] = None
    status: str
    is_anonymous: bool
    donor_message: Optional[str] = None
    donor_name: str
    donor_mobile: str
    donor_email: Optional[str] = None
    event_title: Optional[str] = None
    receipt_number: Optional[str] = None
    receipt_download_url: Optional[str] = None
    collected_by_name: Optional[str] = None
    verified_by_name: Optional[str] = None
    verified_at: Optional[datetime] = None
    created_at: datetime
    class Config:
        from_attributes = True
