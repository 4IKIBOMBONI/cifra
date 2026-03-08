from datetime import date, datetime, time
from uuid import UUID

from pydantic import BaseModel


class SlotCreate(BaseModel):
    direction_id: UUID
    resource_id: UUID | None = None
    trainer_id: UUID | None = None
    date: date
    start_time: time
    end_time: time
    duration_minutes: int
    type: str = "individual"  # individual, team, open
    capacity: int = 1


class SlotGenerateRequest(BaseModel):
    direction_id: UUID
    resource_id: UUID | None = None
    trainer_id: UUID | None = None
    start_date: date
    end_date: date
    weekdays: list[int]  # 0=Mon, 6=Sun
    day_start_time: time
    day_end_time: time
    duration_minutes: int
    type: str = "individual"
    capacity: int = 1


class SlotResponse(BaseModel):
    id: UUID
    direction_id: UUID
    resource_id: UUID | None = None
    trainer_id: UUID | None = None
    date: date
    start_time: time
    end_time: time
    duration_minutes: int
    type: str
    capacity: int
    current_count: int
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class BookingCreate(BaseModel):
    slot_id: UUID
    team_id: UUID | None = None


class BookingResponse(BaseModel):
    id: UUID
    slot_id: UUID
    user_id: UUID
    team_id: UUID | None = None
    status: str
    attended: bool | None = None
    cancelled_at: datetime | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class AttendanceUpdate(BaseModel):
    user_id: UUID
    attended: bool
