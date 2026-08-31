from datetime import datetime
from typing import Optional, Dict, Any
from uuid import UUID
from pydantic import BaseModel

class AuditLogOut(BaseModel):
    id: int
    user_id: Optional[UUID] = None
    user_name: Optional[str] = None
    action: str
    entity: str
    entity_id: str
    old_values: Optional[Dict[str, Any]] = None
    new_values: Optional[Dict[str, Any]] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    created_at: datetime
    class Config:
        from_attributes = True
