from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user, require_roles
from app.resources.models import Resource
from app.users.models import User

router = APIRouter(prefix="/api/v1/resources", tags=["resources"])


class ResourceCreate(BaseModel):
    direction_id: UUID
    location_id: UUID | None = None
    name: str
    type: str = "equipment"
    description: str | None = None
    photo_url: str | None = None
    capacity: int | None = None
    metadata_json: dict | None = None


class ResourceResponse(BaseModel):
    id: UUID
    direction_id: UUID
    location_id: UUID | None = None
    name: str
    type: str
    description: str | None = None
    photo_url: str | None = None
    status: str
    capacity: int | None = None

    model_config = {"from_attributes": True}


@router.get("/", response_model=list[ResourceResponse])
async def list_resources(
    direction_id: UUID | None = None,
    status: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    query = select(Resource)
    if direction_id:
        query = query.where(Resource.direction_id == direction_id)
    if status:
        query = query.where(Resource.status == status)
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/", response_model=ResourceResponse)
async def create_resource(
    data: ResourceCreate,
    _: User = Depends(require_roles("admin")),
    db: AsyncSession = Depends(get_db),
):
    resource = Resource(**data.model_dump())
    db.add(resource)
    await db.flush()
    return resource


@router.patch("/{resource_id}", response_model=ResourceResponse)
async def update_resource(
    resource_id: UUID,
    data: ResourceCreate,
    _: User = Depends(require_roles("admin")),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Resource).where(Resource.id == resource_id))
    resource = result.scalar_one_or_none()
    if not resource:
        raise HTTPException(status_code=404, detail="Ресурс не найден")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(resource, field, value)
    await db.flush()
    return resource
