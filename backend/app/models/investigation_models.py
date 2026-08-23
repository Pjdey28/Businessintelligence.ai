from typing import List, Optional

from pydantic import BaseModel, Field


class Driver(BaseModel):
    dimension: str
    value: str
    contribution_percentage: float
    direction: str


class Evidence(BaseModel):
    source: str
    evidence_type: str
    content: str
    relevance_score: float


class Recommendation(BaseModel):
    action: str
    rationale: str
    priority: str


class InvestigationResponse(BaseModel):
    kpi: str
    current_value: float
    previous_value: float
    percentage_change: float

    is_anomaly: bool
    anomaly_score: float

    executive_summary: str

    drivers: List[Driver] = Field(default_factory=list)

    evidence: List[Evidence] = Field(default_factory=list)

    recommendations: List[Recommendation] = Field(
        default_factory=list
    )

    confidence: str
    ambiguity: Optional[str] = None