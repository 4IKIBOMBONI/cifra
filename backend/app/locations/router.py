from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user, require_roles
from app.locations.models import Location
from app.users.models import User

router = APIRouter(prefix="/api/v1/locations", tags=["locations"])


class LocationCreate(BaseModel):
    name: str
    building: str | None = None
    floor: int | None = None
    room: str | None = None
    description: str | None = None
    photo_url: str | None = None
    map_x: float | None = None
    map_y: float | None = None


class LocationResponse(BaseModel):
    id: UUID
    name: str
    building: str | None = None
    floor: int | None = None
    room: str | None = None
    description: str | None = None
    photo_url: str | None = None
    map_x: float | None = None
    map_y: float | None = None
    is_active: bool

    model_config = {"from_attributes": True}


@router.get("/", response_model=list[LocationResponse])
async def list_locations(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Location).where(Location.is_active == True))
    return result.scalars().all()


@router.get("/{location_id}", response_model=LocationResponse)
async def get_location(location_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Location).where(Location.id == location_id))
    location = result.scalar_one_or_none()
    if not location:
        raise HTTPException(status_code=404, detail="Локация не найдена")
    return location


@router.post("/", response_model=LocationResponse)
async def create_location(
    data: LocationCreate,
    _: User = Depends(require_roles("admin")),
    db: AsyncSession = Depends(get_db),
):
    location = Location(**data.model_dump())
    db.add(location)
    await db.flush()
    return location


@router.patch("/{location_id}", response_model=LocationResponse)
async def update_location(
    location_id: UUID,
    data: LocationCreate,
    _: User = Depends(require_roles("admin")),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Location).where(Location.id == location_id))
    location = result.scalar_one_or_none()
    if not location:
        raise HTTPException(status_code=404, detail="Локация не найдена")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(location, field, value)
    await db.flush()
    return location
