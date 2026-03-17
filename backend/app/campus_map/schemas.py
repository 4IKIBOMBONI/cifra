from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class MapPointCreate(BaseModel):
    name: str
    description: str | None = None
    point_type: str  # building, entrance, sport, food, library, parking, other
    x: float
    y: float
    location_id: UUID | None = None
    icon: str | None = None
    color: str | None = None


class MapPointUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    point_type: str | None = None
    x: float | None = None
    y: float | None = None
    location_id: UUID | None = None
    icon: str | None = None
    color: str | None = None
    is_active: bool | None = None


class MapPointResponse(BaseModel):
    id: UUID
    name: str
    description: str | None = None
    point_type: str
    x: float
    y: float
    location_id: UUID | None = None
    icon: str | None = None
    color: str | None = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
