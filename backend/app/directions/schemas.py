from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class DirectionCreate(BaseModel):
    name: str
    slug: str
    description: str | None = None
    icon: str | None = None
    color: str | None = None
    cover_image_url: str | None = None
    default_slot_capacity: int = 1
    slot_durations: list[int] = [30, 60, 120]
    sort_order: int = 0


class DirectionUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    icon: str | None = None
    color: str | None = None
    cover_image_url: str | None = None
    default_slot_capacity: int | None = None
    slot_durations: list[int] | None = None
    is_active: bool | None = None
    sort_order: int | None = None


class DirectionResponse(BaseModel):
    id: UUID
    name: str
    slug: str
    description: str | None = None
    icon: str | None = None
    color: str | None = None
    cover_image_url: str | None = None
    default_slot_capacity: int
    slot_durations: list[int]
    is_active: bool
    sort_order: int
    created_at: datetime

    model_config = {"from_attributes": True}
