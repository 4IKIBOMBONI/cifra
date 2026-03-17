from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import require_roles
from app.telegram.schemas import SendMessageRequest
from app.telegram.service import TelegramService
from app.users.models import User

router = APIRouter(prefix="/api/v1/telegram", tags=["telegram"])


@router.post("/webhook")
async def telegram_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    update = await request.json()
    service = TelegramService(db)
    await service.handle_update(update)
    return {"ok": True}


@router.post("/send")
async def send_message(
    data: SendMessageRequest,
    _: User = Depends(require_roles("admin")),
    db: AsyncSession = Depends(get_db),
):
    service = TelegramService(db)
    success = await service.send_message(data.chat_id, data.text)
    if not success:
        return {"ok": False, "detail": "Не удалось отправить сообщение"}
    return {"ok": True}
