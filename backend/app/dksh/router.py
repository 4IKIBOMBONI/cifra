from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user, require_roles
from app.dksh.models import DkshProfile
from app.users.models import User

router = APIRouter(prefix="/api/v1/dksh", tags=["dksh"])


class DkshProfileCreate(BaseModel):
    about: str | None = None
    skills: list[str] = []
    interests: list[str] = []
    achievements: list[str] = []
    directions: list[str] = []
    experience: str | None = None
    contact_telegram: str | None = None
    contact_vk: str | None = None
    contact_phone: str | None = None


class DkshProfileResponse(BaseModel):
    id: UUID
    user_id: UUID
    about: str | None = None
    skills: list = []
    interests: list = []
    achievements: list = []
    directions: list = []
    experience: str | None = None
    contact_telegram: str | None = None
    contact_vk: str | None = None
    contact_phone: str | None = None
    is_active: bool

    model_config = {"from_attributes": True}


@router.get("/my", response_model=DkshProfileResponse | None)
async def my_dksh_profile(
    user: User = Depends(require_roles("student")),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(DkshProfile).where(DkshProfile.user_id == user.id))
    return result.scalar_one_or_none()


@router.post("/", response_model=DkshProfileResponse)
async def create_or_update_dksh(
    data: DkshProfileCreate,
    user: User = Depends(require_roles("student")),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(DkshProfile).where(DkshProfile.user_id == user.id))
    profile = result.scalar_one_or_none()

    if profile:
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(profile, field, value)
    else:
        profile = DkshProfile(user_id=user.id, **data.model_dump())
        db.add(profile)

    await db.flush()
    return profile


@router.get("/candidates", response_model=list[DkshProfileResponse])
async def list_candidates(
    direction: str | None = None,
    _: User = Depends(require_roles("admin")),
    db: AsyncSession = Depends(get_db),
):
    query = select(DkshProfile).where(DkshProfile.is_active == True)
    result = await db.execute(query)
    return result.scalars().all()
