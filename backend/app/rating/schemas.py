from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class RatingEventResponse(BaseModel):
    id: UUID
    user_id: UUID
    event_type: str
    points: int
    balance_after: int
    reason: str
    related_entity_type: str | None = None
    related_entity_id: UUID | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class RatingAdjustRequest(BaseModel):
    user_id: UUID
    points: int
    reason: str
    event_type: str = "manual"


class LeaderboardEntry(BaseModel):
    user_id: UUID
    first_name: str
    last_name: str
    avatar_url: str | None = None
    rating_score: int
    rank: int
