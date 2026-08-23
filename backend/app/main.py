from fastapi import FastAPI

from app.api.routes.health import router as health_router
from app.api.routes.investigation import router as investigation_router
from app.core.config import settings


app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
)


app.include_router(
    health_router,
    prefix=settings.api_prefix,
    tags=["Health"],
)

app.include_router(
    investigation_router,
    prefix=settings.api_prefix,
    tags=["Investigation"],
)


@app.get("/")
def root():
    return {
        "name": settings.app_name,
        "status": "running",
    }