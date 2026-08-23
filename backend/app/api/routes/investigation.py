from fastapi import APIRouter

from app.models.kpi_models import KPIRequest


router = APIRouter()


@router.post("/investigate")
def investigate(request: KPIRequest):
    return {
        "status": "accepted",
        "kpi": request.kpi,
        "period": request.period,
    }