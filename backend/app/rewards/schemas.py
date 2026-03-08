from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class RewardCreate(BaseModel):
    name: str
    description: str | None = None
    photo_url: str | None = None
    cost_points: int
    stock: int = 0


class RewardUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    photo_url: str | None = None
    cost_points: int | None = None
    stock: int | None = None
    is_active: bool | None = None


class RewardResponse(BaseModel):
    id: UUID
    name: str
    description: str | None = None
    photo_url: str | None = None
    cost_points: int
    stock: int
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class RewardRequestCreate(BaseModel):
    reward_id: UUID


class RewardRequestResponse(BaseModel):
    id: UUID
    user_id: UUID
    reward_id: UUID
    status: str
    points_spent: int
    processed_by: UUID | None = None
    processed_at: datetime | None = None
    created_at: datetime

    model_config = {"from_attributes": True}
