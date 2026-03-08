from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user, require_roles
from app.directions.models import Direction
from app.directions.schemas import DirectionCreate, DirectionResponse, DirectionUpdate
from app.users.models import User

router = APIRouter(prefix="/api/v1/directions", tags=["directions"])


@router.get("/", response_model=list[DirectionResponse])
async def list_directions(
    active_only: bool = True,
    db: AsyncSession = Depends(get_db),
):
    query = select(Direction).order_by(Direction.sort_order)
    if active_only:
        query = query.where(Direction.is_active == True)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{slug}", response_model=DirectionResponse)
async def get_direction(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Direction).where(Direction.slug == slug))
    direction = result.scalar_one_or_none()
    if not direction:
        raise HTTPException(status_code=404, detail="Направление не найдено")
    return direction


@router.post("/", response_model=DirectionResponse)
async def create_direction(
    data: DirectionCreate,
    _: User = Depends(require_roles("admin")),
    db: AsyncSession = Depends(get_db),
):
    direction = Direction(**data.model_dump())
    db.add(direction)
    await db.flush()
    return direction


@router.patch("/{direction_id}", response_model=DirectionResponse)
async def update_direction(
    direction_id: UUID,
    data: DirectionUpdate,
    _: User = Depends(require_roles("admin")),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Direction).where(Direction.id == direction_id))
    direction = result.scalar_one_or_none()
    if not direction:
        raise HTTPException(status_code=404, detail="Направление не найдено")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(direction, field, value)
    await db.flush()
    return direction


@router.delete("/{direction_id}")
async def delete_direction(
    direction_id: UUID,
    _: User = Depends(require_roles("admin")),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Direction).where(Direction.id == direction_id))
    direction = result.scalar_one_or_none()
    if not direction:
        raise HTTPException(status_code=404, detail="Направление не найдено")

    direction.is_active = False
    await db.flush()
    return {"detail": "Направление деактивировано"}
