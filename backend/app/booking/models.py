import uuid
from datetime import date, datetime, time

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Integer, String, Time, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Slot(Base):
    __tablename__ = "slots"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    direction_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("directions.id"), nullable=False, index=True)
    resource_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("resources.id"))
    trainer_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), index=True)
    date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    start_time: Mapped[time] = mapped_column(Time, nullable=False)
    end_time: Mapped[time] = mapped_column(Time, nullable=False)
    duration_minutes: Mapped[int] = mapped_column(Integer, nullable=False)
    type: Mapped[str] = mapped_column(String(20), nullable=False, default="individual")  # individual, team, open
    capacity: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    current_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="available", index=True)  # available, full, in_progress, completed, cancelled
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("resource_id", "date", "start_time", name="uq_slot_resource_time"),
    )

    direction = relationship("Direction", back_populates="slots")
    resource = relationship("Resource", back_populates="slots")
    trainer = relationship("User", foreign_keys=[trainer_id])
    bookings = relationship("Booking", back_populates="slot", lazy="selectin")


class Booking(Base):
    __tablename__ = "bookings"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slot_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("slots.id"), nullable=False, index=True)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    team_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("teams.id"))
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="confirmed")  # confirmed, cancelled, completed, no_show
    attended: Mapped[bool | None] = mapped_column(Boolean)
    cancelled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    cancellation_reason: Mapped[str | None] = mapped_column(String(500))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("slot_id", "user_id", name="uq_booking_user_slot"),
    )

    slot = relationship("Slot", back_populates="bookings")
    user = relationship("User", back_populates="bookings")
    team = relationship("Team", back_populates="bookings")
