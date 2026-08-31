from typing import Optional, Dict, Any
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.audit import AuditLog

async def log_action(
    db: AsyncSession,
    action: str,
    entity: str,
    entity_id: str,
    user_id: Optional[UUID] = None,
    old_values: Optional[Dict[str, Any]] = None,
    new_values: Optional[Dict[str, Any]] = None,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None
):
    try:
        log_entry = AuditLog(
            user_id=user_id,
            action=action,
            entity=entity,
            entity_id=str(entity_id),
            old_values=old_values,
            new_values=new_values,
            ip_address=ip_address,
            user_agent=user_agent
        )
        db.add(log_entry)
        await db.flush()
    except Exception as e:
        print(f"Error recording audit log: {e}")
