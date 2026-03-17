from datetime import date
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.booking.models import Booking, Slot
from app.database import get_db
from app.dependencies import require_roles
from app.directions.models import Direction
from app.export.service import ExportService
from app.resources.models import Resource
from app.users.models import User

router = APIRouter(prefix="/api/v1/export", tags=["export"])


async def _fetch_bookings(
    db: AsyncSession,
    date_from: date | None = None,
    date_to: date | None = None,
    direction_id: UUID | None = None,
) -> list[dict]:
    query = (
        select(Booking, Slot, User)
        .join(Slot, Booking.slot_id == Slot.id)
        .join(User, Booking.user_id == User.id)
        .order_by(Slot.date.desc(), Slot.start_time.desc())
    )
    if date_from:
        query = query.where(Slot.date >= date_from)
    if date_to:
        query = query.where(Slot.date <= date_to)
    if direction_id:
        query = query.where(Slot.direction_id == direction_id)

    result = await db.execute(query)
    rows = result.all()

    bookings_data = []
    for booking, slot, user in rows:
        # Fetch direction name
        dir_result = await db.execute(select(Direction).where(Direction.id == slot.direction_id))
        direction = dir_result.scalar_one_or_none()

        # Fetch resource name
        resource_name = ""
        if slot.resource_id:
            res_result = await db.execute(select(Resource).where(Resource.id == slot.resource_id))
            resource = res_result.scalar_one_or_none()
            resource_name = resource.name if resource else ""

        attended_str = ""
        if booking.attended is True:
            attended_str = "Да"
        elif booking.attended is False:
            attended_str = "Нет"

        bookings_data.append({
            "date": slot.date.isoformat() if slot.date else "",
            "time": f"{slot.start_time.strftime('%H:%M')}–{slot.end_time.strftime('%H:%M')}",
            "direction": direction.name if direction else "",
            "resource": resource_name,
            "student": f"{user.last_name} {user.first_name}",
            "email": user.email,
            "status": booking.status,
            "attended": attended_str,
            "created_at": booking.created_at.strftime("%d.%m.%Y %H:%M") if booking.created_at else "",
        })
    return bookings_data


@router.get("/bookings/excel")
async def export_bookings_excel(
    date_from: date | None = Query(None),
    date_to: date | None = Query(None),
    direction_id: UUID | None = Query(None),
    _: User = Depends(require_roles("admin")),
    db: AsyncSession = Depends(get_db),
):
    bookings_data = await _fetch_bookings(db, date_from, date_to, direction_id)
    output = ExportService.export_bookings_excel(bookings_data, date_from, date_to)
    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=bookings.xlsx"},
    )


@router.get("/users/excel")
async def export_users_excel(
    _: User = Depends(require_roles("admin")),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).order_by(User.last_name, User.first_name))
    users = result.scalars().all()

    users_data = []
    for u in users:
        users_data.append({
            "last_name": u.last_name,
            "first_name": u.first_name,
            "patronymic": u.patronymic or "",
            "email": u.email,
            "role": u.role,
            "rating_score": u.rating_score,
            "is_verified": u.is_verified,
            "is_active": u.is_active,
            "created_at": u.created_at.strftime("%d.%m.%Y %H:%M") if u.created_at else "",
        })

    output = ExportService.export_users_excel(users_data)
    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=users.xlsx"},
    )


@router.get("/rating/excel")
async def export_rating_excel(
    _: User = Depends(require_roles("admin")),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(User)
        .where(User.is_active == True)
        .order_by(User.rating_score.desc(), User.last_name)
    )
    users = result.scalars().all()

    rating_data = []
    for u in users:
        rating_data.append({
            "last_name": u.last_name,
            "first_name": u.first_name,
            "email": u.email,
            "rating_score": u.rating_score,
        })

    output = ExportService.export_rating_excel(rating_data)
    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=rating.xlsx"},
    )


@router.get("/bookings/pdf")
async def export_bookings_pdf(
    date_from: date | None = Query(None),
    date_to: date | None = Query(None),
    direction_id: UUID | None = Query(None),
    _: User = Depends(require_roles("admin")),
    db: AsyncSession = Depends(get_db),
):
    bookings_data = await _fetch_bookings(db, date_from, date_to, direction_id)
    output = ExportService.export_bookings_pdf(bookings_data, date_from, date_to)
    return StreamingResponse(
        output,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=bookings_report.pdf"},
    )
