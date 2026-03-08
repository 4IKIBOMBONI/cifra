from datetime import datetime, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user, require_roles
from app.rating.service import RatingService
from app.rewards.models import Reward, RewardRequest
from app.rewards.schemas import (
    RewardCreate, RewardRequestCreate, RewardRequestResponse,
    RewardResponse, RewardUpdate,
)
from app.users.models import User

router = APIRouter(prefix="/api/v1/rewards", tags=["rewards"])


@router.get("/", response_model=list[RewardResponse])
async def list_rewards(
    active_only: bool = True,
    _: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(Reward).order_by(Reward.cost_points)
    if active_only:
        query = query.where(Reward.is_active == True)
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/", response_model=RewardResponse)
async def create_reward(
    data: RewardCreate,
    _: User = Depends(require_roles("admin")),
    db: AsyncSession = Depends(get_db),
):
    reward = Reward(**data.model_dump())
    db.add(reward)
    await db.flush()
    return reward


@router.patch("/{reward_id}", response_model=RewardResponse)
async def update_reward(
    reward_id: UUID,
    data: RewardUpdate,
    _: User = Depends(require_roles("admin")),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Reward).where(Reward.id == reward_id))
    reward = result.scalar_one_or_none()
    if not reward:
        raise HTTPException(status_code=404, detail="Награда не найдена")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(reward, field, value)
    await db.flush()
    return reward


@router.post("/request", response_model=RewardRequestResponse)
async def request_reward(
    data: RewardRequestCreate,
    user: User = Depends(require_roles("student")),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Reward).where(Reward.id == data.reward_id))
    reward = result.scalar_one_or_none()
    if not reward or not reward.is_active:
        raise HTTPException(status_code=404, detail="Награда не найдена")
    if reward.stock <= 0:
        raise HTTPException(status_code=400, detail="Награда закончилась")
    if user.rating_score < reward.cost_points:
        raise HTTPException(status_code=400, detail=f"Недостаточно баллов (нужно ещё {reward.cost_points - user.rating_score})")

    # Deduct points
    rating_service = RatingService(db)
    await rating_service.adjust_rating(
        user_id=user.id, points=-reward.cost_points,
        reason=f"Получение награды: {reward.name}",
        event_type="reward_spend",
    )

    # Decrease stock
    reward.stock -= 1

    request = RewardRequest(
        user_id=user.id, reward_id=reward.id,
        status="pending", points_spent=reward.cost_points,
    )
    db.add(request)
    await db.flush()
    return request


@router.get("/requests/my", response_model=list[RewardRequestResponse])
async def my_reward_requests(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(RewardRequest).where(RewardRequest.user_id == user.id)
        .order_by(RewardRequest.created_at.desc())
    )
    return result.scalars().all()


@router.post("/requests/{request_id}/issue", response_model=RewardRequestResponse)
async def issue_reward(
    request_id: UUID,
    admin: User = Depends(require_roles("admin")),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(RewardRequest).where(RewardRequest.id == request_id))
    req = result.scalar_one_or_none()
    if not req:
        raise HTTPException(status_code=404, detail="Заявка не найдена")
    if req.status != "pending":
        raise HTTPException(status_code=400, detail="Заявка уже обработана")
    req.status = "issued"
    req.processed_by = admin.id
    req.processed_at = datetime.now(timezone.utc)
    await db.flush()
    return req
