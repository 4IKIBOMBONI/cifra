from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.schemas import LoginRequest, RegisterRequest, TokenResponse, RefreshRequest
from app.auth.service import AuthService
from app.auth.utils import create_access_token, decode_token
from app.database import get_db

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse)
async def register(data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    try:
        user = await service.register_student(
            email=data.email,
            password=data.password,
            first_name=data.first_name,
            last_name=data.last_name,
            patronymic=data.patronymic,
            student_id_number=data.student_id_number,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))

    _, access_token, refresh_token = await service.login(data.email, data.password)
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    try:
        _, access_token, refresh_token = await service.login(data.email, data.password)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))

    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(data: RefreshRequest, db: AsyncSession = Depends(get_db)):
    payload = decode_token(data.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Невалидный refresh token")

    from sqlalchemy import select
    from app.users.models import User

    result = await db.execute(select(User).where(User.id == payload["sub"]))
    user = result.scalar_one_or_none()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="Пользователь не найден или заблокирован")

    access_token = create_access_token({"sub": str(user.id), "role": user.role})
    from app.auth.utils import create_refresh_token
    new_refresh = create_refresh_token({"sub": str(user.id)})

    return TokenResponse(access_token=access_token, refresh_token=new_refresh)
