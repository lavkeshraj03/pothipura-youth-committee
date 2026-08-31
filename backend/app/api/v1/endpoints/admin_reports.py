import csv
import io
from fastapi import APIRouter, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.donation import Donation
from app.models.expense import Expense

router = APIRouter()

@router.get("/donations/csv")
async def export_donations_csv(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    stmt = select(Donation).order_by(desc(Donation.created_at))
    res = await db.execute(stmt)
    donations = res.scalars().all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Donation ID", "Receipt Number", "Donor Name", "Mobile", "Amount (INR)",
        "Purpose", "Payment Mode", "Transaction Ref", "Status", "Date"
    ])

    for d in donations:
        receipt_no = d.receipt.receipt_number if d.receipt else "N/A"
        writer.writerow([
            str(d.id),
            receipt_no,
            d.donor.full_name,
            d.donor.mobile,
            f"{d.amount:.2f}",
            d.purpose,
            d.payment_method,
            d.transaction_ref or "",
            d.status,
            d.created_at.strftime("%Y-%m-%d %H:%M:%S")
        ])

    output.seek(0)
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=Donations_Report_Youth_Committee.csv"}
    )

@router.get("/expenses/csv")
async def export_expenses_csv(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    stmt = select(Expense).order_by(desc(Expense.expense_date))
    res = await db.execute(stmt)
    expenses = res.scalars().all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Expense ID", "Category", "Amount (INR)", "Description", "Spent By Member",
        "Vendor", "Payment Method", "Expense Date", "Status"
    ])

    for e in expenses:
        cat_name = e.category.name_hi if e.category else "N/A"
        member_name = e.committee_member.full_name if e.committee_member else "N/A"
        writer.writerow([
            str(e.id),
            cat_name,
            f"{e.amount:.2f}",
            e.description,
            member_name,
            e.vendor_name or "",
            e.payment_method,
            e.expense_date.strftime("%Y-%m-%d"),
            e.status
        ])

    output.seek(0)
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=Expenses_Report_Youth_Committee.csv"}
    )
