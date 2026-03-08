from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.utils import create_access_token, create_refresh_token, hash_password, verify_password
from app.users.models import User, VerificationRecord


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def verify_student(self, first_name: str, last_name: str, patronymic: str | None, student_id_number: str) -> bool:
        query = select(VerificationRecord).where(
            VerificationRecord.student_id_number == student_id_number,
            VerificationRecord.last_name == last_name,
            VerificationRecord.first_name == first_name,
        )
        if patronymic:
            query = query.where(VerificationRecord.patronymic == patronymic)
        result = await self.db.execute(query)
        return result.scalar_one_or_none() is not None

    async def register_student(
        self, email: str, password: str, first_name: str, last_name: str,
        patronymic: str | None, student_id_number: str
    ) -> User:
        # Check if email already exists
        existing = await self.db.execute(select(User).where(User.email == email))
        if existing.scalar_one_or_none():
            raise ValueError("Пользователь с таким email уже зарегистрирован")

        # Check if student_id already used
        existing_sid = await self.db.execute(
            select(User).where(User.student_id_number == student_id_number)
        )
        if existing_sid.scalar_one_or_none():
            raise ValueError("Студенческий билет уже зарегистрирован в системе")

        # Verify student
        is_verified = await self.verify_student(first_name, last_name, patronymic, student_id_number)
        if not is_verified:
            raise PermissionError("Данные не найдены в базе студентов СГТУ")

        user = User(
            email=email,
            password_hash=hash_password(password),
            role="student",
            first_name=first_name,
            last_name=last_name,
            patronymic=patronymic,
            student_id_number=student_id_number,
            is_verified=True,
            rating_score=50,
        )
        self.db.add(user)
        await self.db.flush()
        return user

    async def login(self, email: str, password: str) -> tuple[User, str, str]:
        result = await self.db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

        if not user or not verify_password(password, user.password_hash):
            raise ValueError("Неверный email или пароль")

        if not user.is_active:
            raise PermissionError("Аккаунт заблокирован")

        access_token = create_access_token({"sub": str(user.id), "role": user.role})
        refresh_token = create_refresh_token({"sub": str(user.id)})

        return user, access_token, refresh_token

    async def create_guest_user(
        self, email: str, password: str, first_name: str, last_name: str,
        patronymic: str | None = None
    ) -> User:
        user = User(
            email=email,
            password_hash=hash_password(password),
            role="guest",
            first_name=first_name,
            last_name=last_name,
            patronymic=patronymic,
            is_verified=False,
            rating_score=0,
        )
        self.db.add(user)
        await self.db.flush()
        return user
