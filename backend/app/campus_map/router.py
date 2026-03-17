from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.campus_map.models import MapPoint
from app.campus_map.schemas import MapPointCreate, MapPointResponse, MapPointUpdate
from app.database import get_db
from app.dependencies import get_current_user, require_roles
from app.users.models import User

router = APIRouter(prefix="/api/v1/campus-map", tags=["campus-map"])


@router.get("/points", response_model=list[MapPointResponse])
async def list_map_points(
    point_type: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    query = select(MapPoint).where(MapPoint.is_active == True).order_by(MapPoint.name)
    if point_type:
        query = query.where(MapPoint.point_type == point_type)
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/points", response_model=MapPointResponse)
async def create_map_point(
    data: MapPointCreate,
    _: User = Depends(require_roles("admin")),
    db: AsyncSession = Depends(get_db),
):
    point = MapPoint(**data.model_dump())
    db.add(point)
    await db.flush()
    return point


@router.patch("/points/{point_id}", response_model=MapPointResponse)
async def update_map_point(
    point_id: UUID,
    data: MapPointUpdate,
    _: User = Depends(require_roles("admin")),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(MapPoint).where(MapPoint.id == point_id))
    point = result.scalar_one_or_none()
    if not point:
        raise HTTPException(status_code=404, detail="Точка на карте не найдена")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(point, field, value)
    await db.flush()
    return point


@router.delete("/points/{point_id}")
async def delete_map_point(
    point_id: UUID,
    _: User = Depends(require_roles("admin")),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(MapPoint).where(MapPoint.id == point_id))
    point = result.scalar_one_or_none()
    if not point:
        raise HTTPException(status_code=404, detail="Точка на карте не найдена")
    await db.delete(point)
    await db.flush()
    return {"detail": "Точка удалена"}
