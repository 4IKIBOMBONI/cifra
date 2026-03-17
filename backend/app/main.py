import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Import all models so Base.metadata knows about them
    import app.users.models  # noqa: F401
    import app.directions.models  # noqa: F401
    import app.locations.models  # noqa: F401
    import app.resources.models  # noqa: F401
    import app.booking.models  # noqa: F401
    import app.teams.models  # noqa: F401
    import app.rating.models  # noqa: F401
    import app.rewards.models  # noqa: F401
    import app.news.models  # noqa: F401
    import app.materials.models  # noqa: F401
    import app.dksh.models  # noqa: F401
    import app.notifications.models  # noqa: F401
    import app.audit.models  # noqa: F401
    import app.campus_map.models  # noqa: F401
    import app.telegram.models  # noqa: F401

    # Create all tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables created")

    # Run seed if DB is empty
    try:
        from app.seed import seed_data
        await seed_data()
        logger.info("Seed data loaded")
    except Exception as e:
        logger.warning(f"Seed skipped or failed: {e}")

    yield


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and register all routers
from app.auth.router import router as auth_router
from app.users.router import router as users_router
from app.directions.router import router as directions_router
from app.locations.router import router as locations_router
from app.resources.router import router as resources_router
from app.booking.router import router as booking_router
from app.teams.router import router as teams_router
from app.rating.router import router as rating_router
from app.rewards.router import router as rewards_router
from app.news.router import router as news_router
from app.materials.router import router as materials_router
from app.dksh.router import router as dksh_router
from app.notifications.router import router as notifications_router
from app.analytics.router import router as analytics_router
from app.audit.router import router as audit_router
from app.uploads.router import router as uploads_router
from app.campus_map.router import router as campus_map_router
from app.export.router import router as export_router
from app.telegram.router import router as telegram_router

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(directions_router)
app.include_router(locations_router)
app.include_router(resources_router)
app.include_router(booking_router)
app.include_router(teams_router)
app.include_router(rating_router)
app.include_router(rewards_router)
app.include_router(news_router)
app.include_router(materials_router)
app.include_router(dksh_router)
app.include_router(notifications_router)
app.include_router(analytics_router)
app.include_router(audit_router)
app.include_router(uploads_router)
app.include_router(campus_map_router)
app.include_router(export_router)
app.include_router(telegram_router)


@app.get("/api/health")
async def health():
    return {"status": "ok", "version": settings.APP_VERSION}
