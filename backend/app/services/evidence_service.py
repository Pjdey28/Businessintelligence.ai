from typing import Any

from app.models.investigation_models import Evidence


class EvidenceFusionService:
    """
    Combines deterministic analytical results with
    retrieved unstructured business evidence.

    This service does not make causal claims.
    It prepares evidence for the reasoning layer.
    """

    def build_package(
        self,
        kpi: dict,
        anomaly: dict,
        drivers: list[dict],
        operational_drivers: list[dict],
        retrieved_evidence: list[dict],
    ) -> dict[str, Any]:

        structured_evidence = {
            "kpi": {
                "name": kpi["name"],
                "current_value": kpi["current_value"],
                "previous_value": kpi["previous_value"],
                "percentage_change": kpi[
                    "percentage_change"
                ],
            },
            "anomaly": {
                "is_anomaly": anomaly[
                    "is_anomaly"
                ],
                "anomaly_score": anomaly[
                    "anomaly_score"
                ],
                "baseline_value": anomaly[
                    "baseline_value"
                ],
                "deviation_percentage": anomaly[
                    "deviation_percentage"
                ],
            },
            "dimension_drivers": drivers,
            "operational_relationships":
                operational_drivers,
        }

        document_evidence = [
            Evidence(
                source=item["source"],
                evidence_type=item[
                    "evidence_type"
                ],
                content=item["content"],
                relevance_score=item[
                    "relevance_score"
                ],
            ).model_dump()
            for item in retrieved_evidence
        ]

        evidence_strength = (
            self._calculate_evidence_strength(
                anomaly=anomaly,
                drivers=drivers,
                operational_drivers=(
                    operational_drivers
                ),
                retrieved_evidence=(
                    retrieved_evidence
                ),
            )
        )

        ambiguity = (
            self._identify_ambiguity(
                anomaly=anomaly,
                drivers=drivers,
                operational_drivers=(
                    operational_drivers
                ),
                retrieved_evidence=(
                    retrieved_evidence
                ),
            )
        )

        return {
            "structured_evidence":
                structured_evidence,
            "document_evidence":
                document_evidence,
            "evidence_strength":
                evidence_strength,
            "ambiguity":
                ambiguity,
        }

    def _calculate_evidence_strength(
        self,
        anomaly: dict,
        drivers: list[dict],
        operational_drivers: list[dict],
        retrieved_evidence: list[dict],
    ) -> str:

        score = 0

        if anomaly["is_anomaly"]:
            score += 2

        if drivers:
            score += 2

        strong_relationships = [
            item
            for item in operational_drivers
            if abs(
                item["correlation"]
            ) >= 0.6
        ]

        if strong_relationships:
            score += 2

        relevant_documents = [
            item
            for item in retrieved_evidence
            if item["relevance_score"] >= 0.35
        ]

        if relevant_documents:
            score += 2

        if score >= 7:
            return "high"

        if score >= 4:
            return "medium"

        return "low"

    def _identify_ambiguity(
        self,
        anomaly: dict,
        drivers: list[dict],
        operational_drivers: list[dict],
        retrieved_evidence: list[dict],
    ) -> str | None:

        issues = []

        if not anomaly["is_anomaly"]:
            issues.append(
                "The KPI movement may fall within "
                "normal historical variation."
            )

        if not drivers:
            issues.append(
                "No significant dimensional "
                "drivers were identified."
            )

        if not operational_drivers:
            issues.append(
                "No meaningful operational "
                "relationships were identified."
            )

        if not retrieved_evidence:
            issues.append(
                "No relevant unstructured evidence "
                "was retrieved."
            )

        strong_relationships = [
            item
            for item in operational_drivers
            if abs(
                item["correlation"]
            ) >= 0.6
        ]

        if not strong_relationships:
            issues.append(
                "Available data does not provide "
                "strong statistical support for "
                "a likely operational driver."
            )

        if not issues:
            return None

        return " ".join(issues)