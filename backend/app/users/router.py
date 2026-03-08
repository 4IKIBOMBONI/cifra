from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.utils import hash_password
from app.database import get_db
from app.dependencies import get_current_user, require_roles
from app.users.models import User
from app.users.schemas import UserAdminUpdate, UserCreateByAdmin, UserResponse, UserUpdate

router = APIRouter(prefix="/api/v1/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
async def get_me(user: User = Depends(get_current_user)):
    return user


@router.patch("/me", response_model=UserResponse)
async def update_me(
    data: UserUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    await db.flush()
    return user


@router.get("/", response_model=list[UserResponse])
async def list_users(
    role: str | None = None,
    is_active: bool | None = None,
    search: str | None = None,
    skip: int = 0,
    limit: int = 50,
    _: User = Depends(require_roles("admin")),
    db: AsyncSession = Depends(get_db),
):
    query = select(User)
    if role:
        query = query.where(User.role == role)
    if is_active is not None:
        query = query.where(User.is_active == is_active)
    if search:
        query = query.where(
            (User.first_name.ilike(f"%{search}%"))
            | (User.last_name.ilike(f"%{search}%"))
            | (User.email.ilike(f"%{search}%"))
        )
    query = query.offset(skip).limit(limit).order_by(User.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: UUID,
    _: User = Depends(require_roles("admin")),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    return user


@router.post("/", response_model=UserResponse)
async def create_user_by_admin(
    data: UserCreateByAdmin,
    _: User = Depends(require_roles("admin")),
    db: AsyncSession = Depends(get_db),
):
    existing = await db.execute(select(User).where(User.email == data.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email уже зарегистрирован")

    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        role=data.role,
        first_name=data.first_name,
        last_name=data.last_name,
        patronymic=data.patronymic,
        is_verified=False,
        rating_score=0 if data.role == "guest" else 50,
    )
    db.add(user)
    await db.flush()
    return user


@router.patch("/{user_id}", response_model=UserResponse)
async def update_user_by_admin(
    user_id: UUID,
    data: UserAdminUpdate,
    _: User = Depends(require_roles("admin")),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    await db.flush()
    return user
