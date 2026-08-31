from datetime import datetime, date
from typing import Optional, List
from uuid import UUID
from decimal import Decimal
from pydantic import BaseModel

class ExpenseCategoryBase(BaseModel):
    name_hi: str
    name_en: str
    is_active: bool = True

class ExpenseCategoryCreate(ExpenseCategoryBase):
    pass

class ExpenseCategoryOut(ExpenseCategoryBase):
    id: int
    class Config:
        from_attributes = True

class ExpenseAttachmentOut(BaseModel):
    id: UUID
    file_name: str
    file_url: str
    is_public: bool
    uploaded_at: datetime
    class Config:
        from_attributes = True

class ExpenseBase(BaseModel):
    event_id: Optional[UUID] = None
    category_id: int
    amount: Decimal
    description: str
    committee_member_id: Optional[UUID] = None  # Who spent
    vendor_name: Optional[str] = None
    payment_method: str = "CASH"
    expense_date: date = date.today()
    is_public_disclosed: bool = True
    notes: Optional[str] = None

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseUpdate(BaseModel):
    category_id: Optional[int] = None
    amount: Optional[Decimal] = None
    description: Optional[str] = None
    committee_member_id: Optional[UUID] = None
    vendor_name: Optional[str] = None
    payment_method: Optional[str] = None
    expense_date: Optional[date] = None
    is_public_disclosed: Optional[bool] = None
    notes: Optional[str] = None

class ExpenseAdminOut(ExpenseBase):
    id: UUID
    status: str
    category_name_hi: Optional[str] = None
    category_name_en: Optional[str] = None
    committee_member_name: Optional[str] = None
    event_title: Optional[str] = None
    created_by_name: Optional[str] = None
    approved_by_name: Optional[str] = None
    attachments: List[ExpenseAttachmentOut] = []
    created_at: datetime
    class Config:
        from_attributes = True

# Public Transparency Expense Item
class PublicExpenseOut(BaseModel):
    id: UUID
    category_name_hi: str
    category_name_en: str
    amount: Decimal
    description: str
    committee_member_name: Optional[str] = None
    expense_date: date
    event_title: Optional[str] = None
