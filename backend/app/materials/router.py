from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user, require_roles
from app.materials.models import Material
from app.users.models import User

router = APIRouter(prefix="/api/v1/materials", tags=["materials"])


class MaterialCreate(BaseModel):
    title: str
    type: str
    direction_id: UUID | None = None
    content: str | None = None
    file_url: str | None = None
    external_url: str | None = None
    video_url: str | None = None


class MaterialResponse(BaseModel):
    id: UUID
    title: str
    type: str
    direction_id: UUID | None = None
    content: str | None = None
    file_url: str | None = None
    external_url: str | None = None
    video_url: str | None = None
    author_id: UUID
    is_published: bool

    model_config = {"from_attributes": True}


@router.get("/", response_model=list[MaterialResponse])
async def list_materials(
    type: str | None = None,
    direction_id: UUID | None = None,
    search: str | None = None,
    skip: int = 0,
    limit: int = 50,
    _: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(Material).where(Material.is_published == True)
    if type:
        query = query.where(Material.type == type)
    if direction_id:
        query = query.where(Material.direction_id == direction_id)
    if search:
        query = query.where(Material.title.ilike(f"%{search}%"))
    query = query.offset(skip).limit(limit).order_by(Material.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{material_id}", response_model=MaterialResponse)
async def get_material(
    material_id: UUID,
    _: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Material).where(Material.id == material_id))
    material = result.scalar_one_or_none()
    if not material:
        raise HTTPException(status_code=404, detail="Материал не найден")
    return material


@router.post("/", response_model=MaterialResponse)
async def create_material(
    data: MaterialCreate,
    user: User = Depends(require_roles("admin")),
    db: AsyncSession = Depends(get_db),
):
    material = Material(**data.model_dump(), author_id=user.id)
    db.add(material)
    await db.flush()
    return material
