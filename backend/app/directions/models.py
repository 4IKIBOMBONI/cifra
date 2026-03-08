import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Direction(Base):
    __tablename__ = "directions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(200), unique=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(200), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    icon: Mapped[str | None] = mapped_column(String(100))
    color: Mapped[str | None] = mapped_column(String(7))
    cover_image_url: Mapped[str | None] = mapped_column(String(500))
    default_slot_capacity: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    slot_durations: Mapped[dict] = mapped_column(JSONB, nullable=False, default=[30, 60, 120])
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    resources = relationship("Resource", back_populates="direction", lazy="selectin")
    slots = relationship("Slot", back_populates="direction", lazy="selectin")
