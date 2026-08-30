from typing import List, Optional

from pydantic import BaseModel, Field


class Driver(BaseModel):
    dimension: str
    value: str
    contribution_percentage: float
    direction: str


class OperationalDriver(BaseModel):
    driver: str
    correlation: float
    relationship: str


class Evidence(BaseModel):
    source: str
    evidence_type: str
    content: str
    relevance_score: float


class RootCause(BaseModel):
    cause: str
    explanation: str
    supporting_evidence: List[str] = Field(
        default_factory=list
    )
    confidence: str


class Recommendation(BaseModel):
    action: str
    rationale: str
    priority: str


class TrendPoint(BaseModel):
    period: str
    value: float


class InvestigationResponse(BaseModel):
    kpi: str
    current_value: float
    previous_value: float
    percentage_change: float

    is_anomaly: bool
    anomaly_score: float

    executive_summary: str

    trend: List[TrendPoint] = Field(
        default_factory=list
    )

    root_causes: List[RootCause] = Field(
        default_factory=list
    )

    drivers: List[Driver] = Field(
        default_factory=list
    )

    operational_drivers: List[
        OperationalDriver
    ] = Field(
        default_factory=list
    )

    evidence: List[Evidence] = Field(
        default_factory=list
    )

    recommendations: List[
        Recommendation
    ] = Field(
        default_factory=list
    )

    confidence: str

    ambiguity: Optional[str] = None