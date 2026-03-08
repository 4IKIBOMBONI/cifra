from uuid import UUID

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.audit.models import AuditLog
from app.database import get_db
from app.dependencies import require_roles

router = APIRouter(prefix="/api/v1/audit", tags=["audit"])


class AuditLogResponse(BaseModel):
    id: UUID
    user_id: UUID | None = None
    action: str
    entity_type: str
    entity_id: UUID | None = None
    details: dict | None = None
    ip_address: str | None = None

    model_config = {"from_attributes": True}


@router.get("/", response_model=list[AuditLogResponse])
async def list_audit_logs(
    user_id: UUID | None = None,
    action: str | None = None,
    entity_type: str | None = None,
    skip: int = 0,
    limit: int = 100,
    _=Depends(require_roles("admin")),
    db: AsyncSession = Depends(get_db),
):
    query = select(AuditLog).order_by(AuditLog.created_at.desc())
    if user_id:
        query = query.where(AuditLog.user_id == user_id)
    if action:
        query = query.where(AuditLog.action == action)
    if entity_type:
        query = query.where(AuditLog.entity_type == entity_type)
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()
