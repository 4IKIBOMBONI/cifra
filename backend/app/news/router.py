from datetime import datetime, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user, require_roles
from app.news.models import NewsPost
from app.news.schemas import NewsPostCreate, NewsPostResponse, NewsPostUpdate
from app.users.models import User

router = APIRouter(prefix="/api/v1/news", tags=["news"])


@router.get("/", response_model=list[NewsPostResponse])
async def list_news(
    type: str | None = None,
    direction_id: UUID | None = None,
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
):
    query = select(NewsPost).where(NewsPost.is_published == True).order_by(NewsPost.published_at.desc())
    if type:
        query = query.where(NewsPost.type == type)
    if direction_id:
        query = query.where(NewsPost.direction_id == direction_id)
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{slug}", response_model=NewsPostResponse)
async def get_news(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(NewsPost).where(NewsPost.slug == slug))
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Публикация не найдена")
    return post


@router.post("/", response_model=NewsPostResponse)
async def create_news(
    data: NewsPostCreate,
    user: User = Depends(require_roles("admin")),
    db: AsyncSession = Depends(get_db),
):
    post = NewsPost(**data.model_dump(), author_id=user.id)
    if data.is_published:
        post.published_at = datetime.now(timezone.utc)
    db.add(post)
    await db.flush()
    return post


@router.patch("/{post_id}", response_model=NewsPostResponse)
async def update_news(
    post_id: UUID,
    data: NewsPostUpdate,
    _: User = Depends(require_roles("admin")),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(NewsPost).where(NewsPost.id == post_id))
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Публикация не найдена")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(post, field, value)

    if data.is_published and not post.published_at:
        post.published_at = datetime.now(timezone.utc)

    await db.flush()
    return post
