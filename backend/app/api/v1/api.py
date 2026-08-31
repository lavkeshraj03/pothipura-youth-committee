from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth, public, admin_donations, admin_expenses,
    admin_members, admin_events, admin_announcements,
    admin_education, admin_reports, admin_settings, admin_audit
)

api_router = APIRouter()

# Public Routes
api_router.include_router(public.router, prefix="/public", tags=["Public Portal"])

# Authentication
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# Admin Subsystems
api_router.include_router(admin_donations.router, prefix="/admin/donations", tags=["Admin Donations"])
api_router.include_router(admin_expenses.router, prefix="/admin/expenses", tags=["Admin Expenses"])
api_router.include_router(admin_members.router, prefix="/admin/members", tags=["Admin Committee Members"])
api_router.include_router(admin_events.router, prefix="/admin/events", tags=["Admin Events"])
api_router.include_router(admin_announcements.router, prefix="/admin/announcements", tags=["Admin Announcements"])
api_router.include_router(admin_education.router, prefix="/admin/education", tags=["Admin Education Initiative"])
api_router.include_router(admin_reports.router, prefix="/admin/reports", tags=["Admin Reports & Exports"])
api_router.include_router(admin_settings.router, prefix="/admin/settings", tags=["Admin Site Settings"])
api_router.include_router(admin_audit.router, prefix="/admin/audit-logs", tags=["Admin Audit Logs"])
