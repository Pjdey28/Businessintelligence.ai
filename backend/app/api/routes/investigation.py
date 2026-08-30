import pandas as pd

from fastapi import APIRouter, HTTPException

from app.models.kpi_models import KPIRequest
from app.services.anomaly_service import AnomalyService
from app.services.decomposition_service import (
    DecompositionService,
)
from app.services.driver_service import DriverService
from app.services.kpi_service import KPIService


router = APIRouter()

kpi_service = KPIService()
anomaly_service = AnomalyService()
decomposition_service = DecompositionService()
driver_service = DriverService()


@router.post("/investigate")
def investigate(request: KPIRequest):

    try:
        df = kpi_service.get_data()
        latest_date = df["date"].max()
        current_period = latest_date.strftime(
            "%Y-%m"
        )
        previous_period = (
            latest_date - pd.DateOffset(
                months=1
            )
        ).strftime("%Y-%m")

        kpi = kpi_service.calculate_kpi(
            kpi=request.kpi,
            current_period=current_period,
            previous_period=previous_period,
        )

        column = (
            kpi_service.SUPPORTED_KPIS[
                request.kpi.lower()
            ]
        )

        anomaly = anomaly_service.detect(
            df=df,
            kpi_column=column,
            current_period=current_period,
        )

        drivers = decomposition_service.decompose(
            df=df,
            kpi_column=column,
            current_period=current_period,
            previous_period=previous_period,
        )

        operational_drivers = (
            driver_service.analyze(
                df=df,
                kpi_column=column,
            )
        )

        return {
            "status": "success",
            "kpi": kpi.model_dump(),
            "anomaly": anomaly.model_dump(),
            "drivers": [
                driver.model_dump()
                for driver in drivers
            ],
            "operational_drivers":
                operational_drivers,
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