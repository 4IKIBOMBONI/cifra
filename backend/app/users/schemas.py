from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr


class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    role: str
    first_name: str
    last_name: str
    patronymic: str | None = None
    student_id_number: str | None = None
    avatar_url: str | None = None
    telegram: str | None = None
    phone: str | None = None
    rating_score: int
    is_active: bool
    is_verified: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    patronymic: str | None = None
    avatar_url: str | None = None
    telegram: str | None = None
    phone: str | None = None


class UserAdminUpdate(BaseModel):
    role: str | None = None
    is_active: bool | None = None
    rating_score: int | None = None


class UserCreateByAdmin(BaseModel):
    email: EmailStr
    password: str
    role: str = "guest"
    first_name: str
    last_name: str
    patronymic: str | None = None
