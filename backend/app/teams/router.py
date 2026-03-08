from datetime import datetime, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user, require_roles
from app.teams.models import Team, TeamMember
from app.users.models import User

router = APIRouter(prefix="/api/v1/teams", tags=["teams"])


class TeamCreate(BaseModel):
    name: str
    direction_id: UUID


class TeamResponse(BaseModel):
    id: UUID
    name: str
    direction_id: UUID
    captain_id: UUID
    created_at: datetime

    model_config = {"from_attributes": True}


class TeamMemberResponse(BaseModel):
    id: UUID
    team_id: UUID
    user_id: UUID
    role: str
    status: str

    model_config = {"from_attributes": True}


class InviteRequest(BaseModel):
    user_id: UUID


@router.get("/my", response_model=list[TeamResponse])
async def my_teams(
    user: User = Depends(require_roles("student")),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Team).join(TeamMember).where(
            TeamMember.user_id == user.id,
            TeamMember.status == "accepted",
        )
    )
    return result.scalars().all()


@router.post("/", response_model=TeamResponse)
async def create_team(
    data: TeamCreate,
    user: User = Depends(require_roles("student")),
    db: AsyncSession = Depends(get_db),
):
    team = Team(name=data.name, direction_id=data.direction_id, captain_id=user.id)
    db.add(team)
    await db.flush()

    member = TeamMember(
        team_id=team.id, user_id=user.id, role="captain",
        status="accepted", joined_at=datetime.now(timezone.utc),
    )
    db.add(member)
    await db.flush()
    return team


@router.post("/{team_id}/invite", response_model=TeamMemberResponse)
async def invite_member(
    team_id: UUID,
    data: InviteRequest,
    user: User = Depends(require_roles("student")),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Team).where(Team.id == team_id))
    team = result.scalar_one_or_none()
    if not team or team.captain_id != user.id:
        raise HTTPException(status_code=403, detail="Только капитан может приглашать участников")

    existing = await db.execute(
        select(TeamMember).where(TeamMember.team_id == team_id, TeamMember.user_id == data.user_id)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Пользователь уже в команде или приглашён")

    member = TeamMember(team_id=team_id, user_id=data.user_id, role="member", status="invited")
    db.add(member)
    await db.flush()
    return member


@router.post("/{team_id}/accept")
async def accept_invite(
    team_id: UUID,
    user: User = Depends(require_roles("student")),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(TeamMember).where(
            TeamMember.team_id == team_id,
            TeamMember.user_id == user.id,
            TeamMember.status == "invited",
        )
    )
    member = result.scalar_one_or_none()
    if not member:
        raise HTTPException(status_code=404, detail="Приглашение не найдено")

    member.status = "accepted"
    member.joined_at = datetime.now(timezone.utc)
    await db.flush()
    return {"detail": "Приглашение принято"}


@router.get("/{team_id}/members", response_model=list[TeamMemberResponse])
async def team_members(
    team_id: UUID,
    _: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(TeamMember).where(TeamMember.team_id == team_id)
    )
    return result.scalars().all()
