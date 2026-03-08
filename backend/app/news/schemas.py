from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class NewsPostCreate(BaseModel):
    title: str
    slug: str
    type: str  # news, announcement, result
    direction_id: UUID | None = None
    content: str
    cover_image_url: str | None = None
    event_date: datetime | None = None
    event_location_id: UUID | None = None
    related_announcement_id: UUID | None = None
    is_published: bool = False


class NewsPostUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    cover_image_url: str | None = None
    event_date: datetime | None = None
    is_published: bool | None = None


class NewsPostResponse(BaseModel):
    id: UUID
    title: str
    slug: str
    type: str
    direction_id: UUID | None = None
    content: str
    cover_image_url: str | None = None
    event_date: datetime | None = None
    event_location_id: UUID | None = None
    related_announcement_id: UUID | None = None
    is_published: bool
    published_at: datetime | None = None
    author_id: UUID
    created_at: datetime

    model_config = {"from_attributes": True}
