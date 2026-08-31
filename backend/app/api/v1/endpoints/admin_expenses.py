from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.expense import Expense, ExpenseCategory
from app.schemas.expense import (
    ExpenseAdminOut, ExpenseCreate, ExpenseUpdate,
    ExpenseCategoryOut, ExpenseCategoryCreate
)
from app.services.audit_service import log_action

router = APIRouter()

@router.get("/categories", response_model=List[ExpenseCategoryOut])
async def list_categories(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    stmt = select(ExpenseCategory).where(ExpenseCategory.is_active == True)
    res = await db.execute(stmt)
    return res.scalars().all()

@router.post("/categories", response_model=ExpenseCategoryOut)
async def create_category(req: ExpenseCategoryCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    cat = ExpenseCategory(name_hi=req.name_hi, name_en=req.name_en, is_active=req.is_active)
    db.add(cat)
    await db.commit()
    await db.refresh(cat)
    return cat

@router.get("", response_model=List[ExpenseAdminOut])
async def list_expenses(
    category_id: Optional[int] = None,
    event_id: Optional[UUID] = None,
    member_id: Optional[UUID] = None,
    status_filter: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(Expense).order_by(desc(Expense.expense_date))
    if category_id:
        stmt = stmt.where(Expense.category_id == category_id)
    if event_id:
        stmt = stmt.where(Expense.event_id == event_id)
    if member_id:
        stmt = stmt.where(Expense.committee_member_id == member_id)
    if status_filter:
        stmt = stmt.where(Expense.status == status_filter)

    res = await db.execute(stmt)
    expenses = res.scalars().all()

    results = []
    for exp in expenses:
        results.append(ExpenseAdminOut(
            id=exp.id,
            event_id=exp.event_id,
            category_id=exp.category_id,
            amount=exp.amount,
            description=exp.description,
            committee_member_id=exp.committee_member_id,
            vendor_name=exp.vendor_name,
            payment_method=exp.payment_method,
            expense_date=exp.expense_date,
            status=exp.status,
            category_name_hi=exp.category.name_hi if exp.category else None,
            category_name_en=exp.category.name_en if exp.category else None,
            committee_member_name=exp.committee_member.full_name if exp.committee_member else None,
            event_title=exp.event.title_hi if exp.event else None,
            created_by_name=exp.created_by.full_name if exp.created_by else None,
            approved_by_name=exp.approved_by.full_name if exp.approved_by else None,
            is_public_disclosed=exp.is_public_disclosed,
            notes=exp.notes,
            attachments=[],
            created_at=exp.created_at
        ))
    return results

@router.post("", response_model=ExpenseAdminOut)
async def create_expense(
    req: ExpenseCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if req.amount <= Decimal("0"):
        raise HTTPException(status_code=400, detail="Expense amount must be greater than zero")

    expense = Expense(
        event_id=req.event_id,
        category_id=req.category_id,
        amount=req.amount,
        description=req.description,
        committee_member_id=req.committee_member_id,
        vendor_name=req.vendor_name,
        payment_method=req.payment_method,
        expense_date=req.expense_date,
        status="APPROVED",
        created_by_user_id=current_user.id,
        approved_by_user_id=current_user.id,
        is_public_disclosed=req.is_public_disclosed,
        notes=req.notes
    )
    db.add(expense)
    await db.flush()

    await log_action(
        db=db,
        action="EXPENSE_CREATE",
        entity="expenses",
        entity_id=str(expense.id),
        user_id=current_user.id,
        new_values={
            "amount": float(expense.amount),
            "description": expense.description,
            "category_id": expense.category_id
        }
    )

    await db.commit()
    await db.refresh(expense)

    return ExpenseAdminOut(
        id=expense.id,
        event_id=expense.event_id,
        category_id=expense.category_id,
        amount=expense.amount,
        description=expense.description,
        committee_member_id=expense.committee_member_id,
        vendor_name=expense.vendor_name,
        payment_method=expense.payment_method,
        expense_date=expense.expense_date,
        status=expense.status,
        category_name_hi=expense.category.name_hi if expense.category else None,
        category_name_en=expense.category.name_en if expense.category else None,
        committee_member_name=expense.committee_member.full_name if expense.committee_member else None,
        event_title=expense.event.title_hi if expense.event else None,
        created_by_name=current_user.full_name,
        approved_by_name=current_user.full_name,
        is_public_disclosed=expense.is_public_disclosed,
        notes=expense.notes,
        attachments=[],
        created_at=expense.created_at
    )

@router.patch("/{id}/void")
async def void_expense(
    id: UUID,
    reason: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(Expense).where(Expense.id == id)
    res = await db.execute(stmt)
    expense = res.scalar_one_or_none()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense record not found")

    old_status = expense.status
    expense.status = "VOIDED"
    expense.notes = (expense.notes or "") + f" [VOIDED: {reason}]"

    await log_action(
        db=db,
        action="EXPENSE_VOID",
        entity="expenses",
        entity_id=str(expense.id),
        user_id=current_user.id,
        old_values={"status": old_status},
        new_values={"status": "VOIDED", "reason": reason}
    )

    await db.commit()
    return {"message": "Expense successfully voided from active ledger", "expense_id": str(expense.id)}
