from datetime import date
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.booking.models import Booking, Slot
from app.booking.schemas import (
    AttendanceUpdate, BookingCreate, BookingResponse,
    SlotGenerateRequest, SlotResponse,
)
from app.booking.service import BookingService
from app.database import get_db
from app.dependencies import get_current_user, require_roles
from app.users.models import User

router = APIRouter(prefix="/api/v1", tags=["booking"])


# --- Slots ---

@router.get("/slots", response_model=list[SlotResponse])
async def list_slots(
    direction_id: UUID | None = None,
    slot_date: date | None = None,
    status: str | None = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
):
    query = select(Slot).order_by(Slot.date, Slot.start_time)
    if direction_id:
        query = query.where(Slot.direction_id == direction_id)
    if slot_date:
        query = query.where(Slot.date == slot_date)
    if status:
        query = query.where(Slot.status == status)
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/slots/{slot_id}", response_model=SlotResponse)
async def get_slot(slot_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Slot).where(Slot.id == slot_id))
    slot = result.scalar_one_or_none()
    if not slot:
        raise HTTPException(status_code=404, detail="Слот не найден")
    return slot


@router.post("/slots/generate", response_model=list[SlotResponse])
async def generate_slots(
    data: SlotGenerateRequest,
    _: User = Depends(require_roles("admin", "trainer")),
    db: AsyncSession = Depends(get_db),
):
    service = BookingService(db)
    slots = await service.generate_slots(
        direction_id=data.direction_id,
        resource_id=data.resource_id,
        trainer_id=data.trainer_id,
        start_date=data.start_date,
        end_date=data.end_date,
        weekdays=data.weekdays,
        day_start=data.day_start_time,
        day_end=data.day_end_time,
        duration_minutes=data.duration_minutes,
        slot_type=data.type,
        capacity=data.capacity,
    )
    return slots


# --- Bookings ---

@router.post("/bookings", response_model=BookingResponse)
async def create_booking(
    data: BookingCreate,
    user: User = Depends(require_roles("student", "trainer", "admin")),
    db: AsyncSession = Depends(get_db),
):
    service = BookingService(db)
    try:
        booking = await service.create_booking(user, data.slot_id, data.team_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    return booking


@router.get("/bookings/my", response_model=list[BookingResponse])
async def my_bookings(
    status: str | None = None,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(Booking).where(Booking.user_id == user.id).order_by(Booking.created_at.desc())
    if status:
        query = query.where(Booking.status == status)
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/bookings/{booking_id}/cancel", response_model=BookingResponse)
async def cancel_booking(
    booking_id: UUID,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = BookingService(db)
    try:
        booking = await service.cancel_booking(user, booking_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    return booking


@router.post("/slots/{slot_id}/attendance")
async def update_attendance(
    slot_id: UUID,
    data: list[AttendanceUpdate],
    user: User = Depends(require_roles("trainer", "admin")),
    db: AsyncSession = Depends(get_db),
):
    service = BookingService(db)
    results = []
    for item in data:
        try:
            booking = await service.confirm_attendance(slot_id, item.user_id, item.attended)
            results.append({"user_id": str(item.user_id), "status": "ok", "attended": item.attended})
        except ValueError as e:
            results.append({"user_id": str(item.user_id), "status": "error", "detail": str(e)})
    return results
