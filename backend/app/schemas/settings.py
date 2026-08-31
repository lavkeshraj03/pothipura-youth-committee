from typing import Optional, Dict, Any
from pydantic import BaseModel

class SiteSettingOut(BaseModel):
    key: str
    value: Any
    description: Optional[str] = None
    class Config:
        from_attributes = True

class UPISettingUpdate(BaseModel):
    upi_id: str
    payee_name: str
    qr_image_url: Optional[str] = None
    donation_note: Optional[str] = None

class TransparencySummaryOut(BaseModel):
    total_verified_donations: float
    total_approved_expenses: float
    net_available_balance: float
    target_fund_goal: float
    fundraising_percentage: float
    verified_donation_count: int
    public_expense_count: int
    event_summary: Dict[str, Any]
    category_expenses: Dict[str, float]
