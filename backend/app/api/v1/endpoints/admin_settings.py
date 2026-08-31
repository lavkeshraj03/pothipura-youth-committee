from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.settings import SiteSetting
from app.schemas.settings import UPISettingUpdate
from app.services.audit_service import log_action

router = APIRouter()

@router.get("/upi")
async def get_upi_settings(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    stmt = select(SiteSetting).where(SiteSetting.key == "upi_settings")
    res = await db.execute(stmt)
    setting = res.scalar_one_or_none()
    if setting:
        return setting.value
    return {
        "upi_id": "youthcommittee@upi",
        "payee_name": "Gram Yuva Samiti",
        "donation_note": "Janmashtami Mahotsav Donation"
    }

@router.put("/upi")
async def update_upi_settings(
    req: UPISettingUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(SiteSetting).where(SiteSetting.key == "upi_settings")
    res = await db.execute(stmt)
    setting = res.scalar_one_or_none()
    
    new_val = {
        "upi_id": req.upi_id,
        "payee_name": req.payee_name,
        "qr_image_url": req.qr_image_url,
        "donation_note": req.donation_note
    }

    if not setting:
        setting = SiteSetting(
            key="upi_settings",
            value=new_val,
            description="UPI configuration for QR donations",
            updated_by_user_id=current_user.id
        )
        db.add(setting)
    else:
        setting.value = new_val
        setting.updated_by_user_id = current_user.id

    await log_action(
        db=db,
        action="UPI_SETTINGS_UPDATE",
        entity="site_settings",
        entity_id="upi_settings",
        user_id=current_user.id,
        new_values=new_val
    )

    await db.commit()
    return {"message": "UPI configuration updated successfully", "settings": new_val}
