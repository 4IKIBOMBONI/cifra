import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class DkshProfile(Base):
    __tablename__ = "dksh_profiles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    about: Mapped[str | None] = mapped_column(Text)
    skills: Mapped[list | None] = mapped_column(JSONB, default=[])
    interests: Mapped[list | None] = mapped_column(JSONB, default=[])
    achievements: Mapped[list | None] = mapped_column(JSONB, default=[])
    directions: Mapped[list | None] = mapped_column(JSONB, default=[])
    experience: Mapped[str | None] = mapped_column(Text)
    contact_telegram: Mapped[str | None] = mapped_column(String(100))
    contact_vk: Mapped[str | None] = mapped_column(String(200))
    contact_phone: Mapped[str | None] = mapped_column(String(20))
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="dksh_profile")
