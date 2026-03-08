from datetime import date, datetime, timezone

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.booking.models import Booking, Slot
from app.database import get_db
from app.dependencies import require_roles
from app.dksh.models import DkshProfile
from app.rating.models import RatingEvent
from app.rewards.models import RewardRequest
from app.users.models import User

router = APIRouter(prefix="/api/v1/analytics", tags=["analytics"])


@router.get("/dashboard")
async def dashboard(
    _=Depends(require_roles("admin")),
    db: AsyncSession = Depends(get_db),
):
    total_users = (await db.execute(select(func.count(User.id)))).scalar() or 0
    active_students = (await db.execute(
        select(func.count(User.id)).where(User.role == "student", User.is_active == True)
    )).scalar() or 0

    today = date.today()
    today_bookings = (await db.execute(
        select(func.count(Booking.id)).join(Slot).where(Slot.date == today, Booking.status == "confirmed")
    )).scalar() or 0

    no_shows = (await db.execute(
        select(func.count(Booking.id)).where(Booking.status == "no_show")
    )).scalar() or 0

    pending_rewards = (await db.execute(
        select(func.count(RewardRequest.id)).where(RewardRequest.status == "pending")
    )).scalar() or 0

    dksh_candidates = (await db.execute(
        select(func.count(DkshProfile.id)).where(DkshProfile.is_active == True)
    )).scalar() or 0

    return {
        "total_users": total_users,
        "active_students": active_students,
        "today_bookings": today_bookings,
        "total_no_shows": no_shows,
        "pending_rewards": pending_rewards,
        "dksh_candidates": dksh_candidates,
    }


@router.get("/bookings")
async def booking_analytics(
    date_from: date | None = None,
    date_to: date | None = None,
    _=Depends(require_roles("admin")),
    db: AsyncSession = Depends(get_db),
):
    query = select(
        Slot.date,
        func.count(Booking.id).label("total"),
        func.count(Booking.id).filter(Booking.status == "completed").label("completed"),
        func.count(Booking.id).filter(Booking.status == "no_show").label("no_shows"),
    ).join(Booking, Booking.slot_id == Slot.id).group_by(Slot.date).order_by(Slot.date)

    if date_from:
        query = query.where(Slot.date >= date_from)
    if date_to:
        query = query.where(Slot.date <= date_to)

    result = await db.execute(query)
    rows = result.all()
    return [
        {"date": str(row.date), "total": row.total, "completed": row.completed, "no_shows": row.no_shows}
        for row in rows
    ]


@router.get("/directions-popularity")
async def directions_popularity(
    _=Depends(require_roles("admin")),
    db: AsyncSession = Depends(get_db),
):
    from app.directions.models import Direction
    result = await db.execute(
        select(
            Direction.name,
            func.count(Booking.id).label("bookings_count"),
        )
        .join(Slot, Slot.direction_id == Direction.id)
        .join(Booking, Booking.slot_id == Slot.id)
        .group_by(Direction.name)
        .order_by(func.count(Booking.id).desc())
    )
    rows = result.all()
    return [{"direction": row.name, "bookings_count": row.bookings_count} for row in rows]
