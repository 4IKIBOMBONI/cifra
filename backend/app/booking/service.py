from datetime import date, datetime, time, timedelta, timezone
from uuid import UUID

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.booking.models import Booking, Slot
from app.users.models import User


# Rating thresholds for booking limits
RATING_LIMITS = {
    "blocked": {"max_score": -1, "weekly_slots": 0},
    "low": {"max_score": 29, "weekly_slots": 1},
    "medium": {"max_score": 69, "weekly_slots": 3},
    "high": {"max_score": float("inf"), "weekly_slots": 5},
}


def get_weekly_slot_limit(rating_score: int) -> int:
    if rating_score < 0:
        return 0
    elif rating_score < 30:
        return 1
    elif rating_score < 70:
        return 3
    else:
        return 5


class BookingService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user_weekly_bookings_count(self, user_id: UUID) -> int:
        now = datetime.now(timezone.utc)
        week_start = (now - timedelta(days=now.weekday())).date()
        week_end = week_start + timedelta(days=7)

        result = await self.db.execute(
            select(func.count(Booking.id))
            .join(Slot)
            .where(
                Booking.user_id == user_id,
                Booking.status == "confirmed",
                Slot.date >= week_start,
                Slot.date < week_end,
            )
        )
        return result.scalar() or 0

    async def create_booking(self, user: User, slot_id: UUID, team_id: UUID | None = None) -> Booking:
        # Get slot
        result = await self.db.execute(select(Slot).where(Slot.id == slot_id))
        slot = result.scalar_one_or_none()
        if not slot:
            raise ValueError("Слот не найден")

        if slot.status != "available":
            raise ValueError("Слот недоступен для бронирования")

        if slot.current_count >= slot.capacity:
            raise ValueError("Слот заполнен")

        # Check rating
        limit = get_weekly_slot_limit(user.rating_score)
        if limit == 0:
            raise PermissionError("Бронирование заблокировано из-за низкого рейтинга")

        # Check weekly limit
        weekly_count = await self.get_user_weekly_bookings_count(user.id)
        if weekly_count >= limit:
            raise PermissionError(f"Превышен лимит бронирований на неделю ({limit})")

        # Check not already booked
        existing = await self.db.execute(
            select(Booking).where(
                Booking.slot_id == slot_id,
                Booking.user_id == user.id,
                Booking.status == "confirmed",
            )
        )
        if existing.scalar_one_or_none():
            raise ValueError("Вы уже записаны на этот слот")

        booking = Booking(
            slot_id=slot_id,
            user_id=user.id,
            team_id=team_id,
            status="confirmed",
        )
        self.db.add(booking)

        slot.current_count += 1
        if slot.current_count >= slot.capacity:
            slot.status = "full"

        await self.db.flush()
        return booking

    async def cancel_booking(self, user: User, booking_id: UUID) -> Booking:
        result = await self.db.execute(
            select(Booking).where(Booking.id == booking_id)
        )
        booking = result.scalar_one_or_none()
        if not booking:
            raise ValueError("Бронирование не найдено")

        if booking.user_id != user.id and user.role not in ("admin", "trainer"):
            raise PermissionError("Нет прав на отмену этого бронирования")

        if booking.status != "confirmed":
            raise ValueError("Бронирование уже отменено или завершено")

        # Check 24h rule (skip for admin/trainer)
        if user.role not in ("admin", "trainer"):
            slot = await self.db.get(Slot, booking.slot_id)
            slot_datetime = datetime.combine(slot.date, slot.start_time, tzinfo=timezone.utc)
            if datetime.now(timezone.utc) > slot_datetime - timedelta(hours=24):
                raise ValueError("Отмена невозможна менее чем за 24 часа до начала. Обратитесь к тренеру.")

        booking.status = "cancelled"
        booking.cancelled_at = datetime.now(timezone.utc)

        # Update slot count
        slot = await self.db.get(Slot, booking.slot_id)
        slot.current_count = max(0, slot.current_count - 1)
        if slot.status == "full":
            slot.status = "available"

        await self.db.flush()
        return booking

    async def confirm_attendance(self, slot_id: UUID, user_id: UUID, attended: bool) -> Booking:
        result = await self.db.execute(
            select(Booking).where(
                Booking.slot_id == slot_id,
                Booking.user_id == user_id,
                Booking.status == "confirmed",
            )
        )
        booking = result.scalar_one_or_none()
        if not booking:
            raise ValueError("Бронирование не найдено")

        booking.attended = attended
        booking.status = "completed" if attended else "no_show"
        await self.db.flush()
        return booking

    async def generate_slots(
        self, direction_id: UUID, resource_id: UUID | None, trainer_id: UUID | None,
        start_date: date, end_date: date, weekdays: list[int],
        day_start: time, day_end: time, duration_minutes: int,
        slot_type: str, capacity: int
    ) -> list[Slot]:
        slots = []
        current_date = start_date
        while current_date <= end_date:
            if current_date.weekday() in weekdays:
                current_time = datetime.combine(current_date, day_start)
                end_of_day = datetime.combine(current_date, day_end)

                while current_time + timedelta(minutes=duration_minutes) <= end_of_day:
                    slot_end = current_time + timedelta(minutes=duration_minutes)
                    slot = Slot(
                        direction_id=direction_id,
                        resource_id=resource_id,
                        trainer_id=trainer_id,
                        date=current_date,
                        start_time=current_time.time(),
                        end_time=slot_end.time(),
                        duration_minutes=duration_minutes,
                        type=slot_type,
                        capacity=capacity,
                    )
                    self.db.add(slot)
                    slots.append(slot)
                    current_time = slot_end

            current_date += timedelta(days=1)

        await self.db.flush()
        return slots
