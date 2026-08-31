from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.audit import AuditLog
from app.schemas.audit import AuditLogOut

router = APIRouter()

@router.get("", response_model=List[AuditLogOut])
async def list_audit_logs(
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(AuditLog).order_by(desc(AuditLog.created_at)).limit(limit)
    res = await db.execute(stmt)
    logs = res.scalars().all()

    results = []
    for l in logs:
        results.append(AuditLogOut(
            id=l.id,
            user_id=l.user_id,
            user_name=l.user.full_name if l.user else "System",
            action=l.action,
            entity=l.entity,
            entity_id=l.entity_id,
            old_values=l.old_values,
            new_values=l.new_values,
            ip_address=l.ip_address,
            user_agent=l.user_agent,
            created_at=l.created_at
        ))
    return results
