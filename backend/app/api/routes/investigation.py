from fastapi import APIRouter, HTTPException

from app.models.kpi_models import KPIRequest
from app.services.kpi_service import KPIService


router = APIRouter()
kpi_service = KPIService()


@router.post("/investigate")
def investigate(request: KPIRequest):

    try:
        current_date = request.period

        current_timestamp = (
            kpi_service.get_data()["date"]
            .max()
        )

        current_period = current_timestamp.strftime(
            "%Y-%m"
        )

        previous_timestamp = (
            current_timestamp - __import__(
                "pandas"
            ).DateOffset(months=1)
        )

        previous_period = previous_timestamp.strftime(
            "%Y-%m"
        )

        kpi = kpi_service.calculate_kpi(
            kpi=request.kpi,
            current_period=current_period,
            previous_period=previous_period,
        )

        return {
            "status": "success",
            "kpi": kpi.model_dump(),
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )