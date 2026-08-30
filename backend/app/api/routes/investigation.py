import pandas as pd

from fastapi import APIRouter, HTTPException

from app.models.kpi_models import KPIRequest
from app.services.anomaly_service import (
    AnomalyService,
)
from app.services.decomposition_service import (
    DecompositionService,
)
from app.services.driver_service import (
    DriverService,
)
from app.services.evidence_service import (
    EvidenceFusionService,
)
from app.services.kpi_service import (
    KPIService,
)
from app.services.llm_service import (
    LLMService,
)
from app.services.retrieval_service import (
    RetrievalService,
)


router = APIRouter()

kpi_service = KPIService()
anomaly_service = AnomalyService()
decomposition_service = (
    DecompositionService()
)
driver_service = DriverService()
retrieval_service = RetrievalService()
evidence_service = (
    EvidenceFusionService()
)
llm_service = LLMService()


@router.post("/investigate")
def investigate(request: KPIRequest):

    try:
        df = kpi_service.get_data()

        latest_date = df["date"].max()

        current_period = (
            latest_date.strftime("%Y-%m")
        )

        previous_period = (
            latest_date
            - pd.DateOffset(months=1)
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

        drivers = (
            decomposition_service.decompose(
                df=df,
                kpi_column=column,
                current_period=current_period,
                previous_period=(
                    previous_period
                ),
            )
        )

        operational_drivers = (
            driver_service.analyze(
                df=df,
                kpi_column=column,
            )
        )

        top_drivers = drivers[:5]

        driver_context = "; ".join(
            [
                (
                    f"{driver.dimension}="
                    f"{driver.value} "
                    f"({driver.direction}, "
                    f"{driver.contribution_percentage}% "
                    f"contribution)"
                )
                for driver in top_drivers
            ]
        )

        retrieval_query = (
            f"Business investigation for "
            f"{request.kpi}. "
            f"Current period {current_period}. "
            f"Previous period {previous_period}. "
            f"Key drivers: {driver_context}. "
            f"Find evidence about sales, inventory, "
            f"operations, delivery delays, stock-outs, "
            f"and customer complaints."
        )

        retrieved_documents = (
            retrieval_service.retrieve(
                query=retrieval_query,
                top_k=3,
            )
        )

        evidence_package = (
            evidence_service.build_package(
                kpi=kpi.model_dump(),
                anomaly=anomaly.model_dump(),
                drivers=[
                    driver.model_dump()
                    for driver in drivers
                ],
                operational_drivers=(
                    operational_drivers
                ),
                retrieved_evidence=(
                    retrieved_documents
                ),
            )
        )

        llm_result = (
            llm_service.generate_investigation(
                evidence_package
            )
        )

        return {
            "status": "success",
            "investigation": {
                "kpi": kpi.model_dump(),
                "anomaly": anomaly.model_dump(),
                "drivers": [
                    driver.model_dump()
                    for driver in drivers
                ],
                "operational_drivers":
                    operational_drivers,
                "evidence":
                    evidence_package[
                        "document_evidence"
                    ],
                "evidence_strength":
                    evidence_package[
                        "evidence_strength"
                    ],
                "executive_summary":
                    llm_result[
                        "executive_summary"
                    ],
                "root_causes":
                    llm_result[
                        "root_causes"
                    ],
                "recommendations":
                    llm_result[
                        "recommendations"
                    ],
                "confidence":
                    llm_result[
                        "confidence"
                    ],
                "ambiguity":
                    llm_result[
                        "ambiguity"
                    ],
            },
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

    except RuntimeError as exc:

        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )