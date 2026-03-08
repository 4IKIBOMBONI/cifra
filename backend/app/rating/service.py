from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.rating.models import RatingEvent
from app.users.models import User


class RatingService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def adjust_rating(
        self, user_id: UUID, points: int, reason: str,
        event_type: str = "manual", created_by: UUID | None = None,
        related_entity_type: str | None = None, related_entity_id: UUID | None = None,
    ) -> RatingEvent:
        result = await self.db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if not user:
            raise ValueError("Пользователь не найден")

        user.rating_score += points
        balance_after = user.rating_score

        event = RatingEvent(
            user_id=user_id,
            event_type=event_type,
            points=points,
            balance_after=balance_after,
            reason=reason,
            related_entity_type=related_entity_type,
            related_entity_id=related_entity_id,
            created_by=created_by,
        )
        self.db.add(event)
        await self.db.flush()
        return event

    async def get_user_history(self, user_id: UUID, limit: int = 50) -> list[RatingEvent]:
        result = await self.db.execute(
            select(RatingEvent)
            .where(RatingEvent.user_id == user_id)
            .order_by(RatingEvent.created_at.desc())
            .limit(limit)
        )
        return list(result.scalars().all())

    async def get_leaderboard(self, limit: int = 20) -> list[User]:
        result = await self.db.execute(
            select(User)
            .where(User.role == "student", User.is_active == True)
            .order_by(User.rating_score.desc())
            .limit(limit)
        )
        return list(result.scalars().all())
