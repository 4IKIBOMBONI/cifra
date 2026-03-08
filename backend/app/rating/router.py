from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user, require_roles
from app.rating.schemas import LeaderboardEntry, RatingAdjustRequest, RatingEventResponse
from app.rating.service import RatingService
from app.users.models import User

router = APIRouter(prefix="/api/v1/rating", tags=["rating"])


@router.get("/my", response_model=list[RatingEventResponse])
async def my_rating_history(
    limit: int = 50,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = RatingService(db)
    return await service.get_user_history(user.id, limit)


@router.get("/leaderboard", response_model=list[LeaderboardEntry])
async def leaderboard(
    limit: int = 20,
    _: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = RatingService(db)
    users = await service.get_leaderboard(limit)
    return [
        LeaderboardEntry(
            user_id=u.id,
            first_name=u.first_name,
            last_name=u.last_name,
            avatar_url=u.avatar_url,
            rating_score=u.rating_score,
            rank=i + 1,
        )
        for i, u in enumerate(users)
    ]


@router.post("/adjust", response_model=RatingEventResponse)
async def adjust_rating(
    data: RatingAdjustRequest,
    admin: User = Depends(require_roles("admin", "trainer")),
    db: AsyncSession = Depends(get_db),
):
    service = RatingService(db)
    try:
        event = await service.adjust_rating(
            user_id=data.user_id,
            points=data.points,
            reason=data.reason,
            event_type=data.event_type,
            created_by=admin.id,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return event
