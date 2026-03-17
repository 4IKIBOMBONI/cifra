from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class TelegramUserResponse(BaseModel):
    id: UUID
    user_id: UUID
    chat_id: int
    username: str | None = None
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class SendMessageRequest(BaseModel):
    chat_id: int
    text: str
