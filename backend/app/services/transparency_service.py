from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.donation import Donation
from app.models.expense import Expense, ExpenseCategory
from app.models.event import Event
from app.schemas.settings import TransparencySummaryOut

class TransparencyService:
    @staticmethod
    async def get_summary(db: AsyncSession) -> TransparencySummaryOut:
        # Total verified donations
        don_stmt = select(
            func.coalesce(func.sum(Donation.amount), 0),
            func.count(Donation.id)
        ).where(Donation.status == "VERIFIED")
        don_res = await db.execute(don_stmt)
        total_donations, don_count = don_res.one()

        # Total approved expenses
        exp_stmt = select(
            func.coalesce(func.sum(Expense.amount), 0),
            func.count(Expense.id)
        ).where(Expense.status == "APPROVED")
        exp_res = await db.execute(exp_stmt)
        total_expenses, exp_count = exp_res.one()

        # Category-wise expenses
        cat_stmt = (
            select(ExpenseCategory.name_hi, func.sum(Expense.amount))
            .join(Expense, Expense.category_id == ExpenseCategory.id)
            .where(Expense.status == "APPROVED")
            .group_by(ExpenseCategory.name_hi)
        )
        cat_res = await db.execute(cat_stmt)
        category_breakdown = {row[0]: float(row[1]) for row in cat_res.all()}

        # Active featured event target
        event_stmt = select(Event).where(Event.is_featured == True)
        event_res = await db.execute(event_stmt)
        featured_event = event_res.scalar_one_or_none()

        target_fund = float(featured_event.target_donation_amount) if (featured_event and featured_event.target_donation_amount) else 500000.0
        tot_don_flt = float(total_donations)
        tot_exp_flt = float(total_expenses)
        net_balance = tot_don_flt - tot_exp_flt
        percentage = round((tot_don_flt / target_fund * 100) if target_fund > 0 else 0, 1)

        event_summary = {}
        if featured_event:
            event_summary = {
                "event_id": str(featured_event.id),
                "title_hi": featured_event.title_hi,
                "title_en": featured_event.title_en,
                "venue": featured_event.venue,
                "start_date": featured_event.start_date.isoformat(),
            }

        return TransparencySummaryOut(
            total_verified_donations=tot_don_flt,
            total_approved_expenses=tot_exp_flt,
            net_available_balance=net_balance,
            target_fund_goal=target_fund,
            fundraising_percentage=min(percentage, 100.0),
            verified_donation_count=don_count,
            public_expense_count=exp_count,
            event_summary=event_summary,
            category_expenses=category_breakdown
        )

transparency_service = TransparencyService()
