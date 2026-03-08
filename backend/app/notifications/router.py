from uuid import UUID

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.notifications.models import Notification
from app.users.models import User

router = APIRouter(prefix="/api/v1/notifications", tags=["notifications"])


class NotificationResponse(BaseModel):
    id: UUID
    type: str
    title: str
    message: str
    is_read: bool
    related_entity_type: str | None = None
    related_entity_id: UUID | None = None

    model_config = {"from_attributes": True}


@router.get("/", response_model=list[NotificationResponse])
async def list_notifications(
    unread_only: bool = False,
    skip: int = 0,
    limit: int = 50,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(Notification).where(Notification.user_id == user.id)
    if unread_only:
        query = query.where(Notification.is_read == False)
    query = query.order_by(Notification.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/unread-count")
async def unread_count(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from sqlalchemy import func
    result = await db.execute(
        select(func.count(Notification.id)).where(
            Notification.user_id == user.id, Notification.is_read == False
        )
    )
    return {"count": result.scalar() or 0}


@router.post("/{notification_id}/read")
async def mark_read(
    notification_id: UUID,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await db.execute(
        update(Notification)
        .where(Notification.id == notification_id, Notification.user_id == user.id)
        .values(is_read=True)
    )
    return {"detail": "ok"}


@router.post("/read-all")
async def mark_all_read(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await db.execute(
        update(Notification)
        .where(Notification.user_id == user.id, Notification.is_read == False)
        .values(is_read=True)
    )
    return {"detail": "ok"}
