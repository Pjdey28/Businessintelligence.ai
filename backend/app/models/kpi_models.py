from pydantic import BaseModel, Field


class KPIValue(BaseModel):
    name: str
    current_value: float
    previous_value: float
    percentage_change: float


class KPIRequest(BaseModel):
    kpi: str = Field(
        ...,
        description="Name of the KPI to investigate"
    )
    period: str = Field(
        ...,
        description="Current analysis period"
    )


class KPIAnomaly(BaseModel):
    is_anomaly: bool
    anomaly_score: float
    baseline_value: float
    deviation_percentage: float