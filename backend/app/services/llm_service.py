import json
import re
from typing import Any

from groq import Groq

from app.core.config import settings


class LLMService:
    """
    Uses the LLM as an evidence-grounded reasoning
    and storytelling layer.

    The model is explicitly instructed not to invent
    business facts or claim causality without evidence.
    """

    def __init__(self):

        if not settings.groq_api_key:
            raise ValueError(
                "GROQ_API_KEY is not configured."
            )

        self.client = Groq(
            api_key=settings.groq_api_key
        )

        self.model = settings.groq_model

    def generate_investigation(
        self,
        evidence_package: dict[str, Any],
    ) -> dict[str, Any]:

        system_prompt = self._build_system_prompt()

        user_prompt = self._build_user_prompt(
            evidence_package
        )

        response = self.client.chat.completions.create(
            model=self.model,
            temperature=0.1,
            messages=[
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": user_prompt,
                },
            ],
            response_format={"type": "json_object"},
        )

        content = response.choices[0].message.content

        if not content:
            raise RuntimeError(
                "LLM returned an empty response."
            )

        sanitized_content = self._sanitize_model_output(
            content
        )

        if not sanitized_content:
            return self._fallback_result_from_evidence(
                evidence_package,
                "The model output did not contain a usable JSON payload.",
            )

        try:
            result = json.loads(
                self._extract_json_payload(
                    sanitized_content
                )
            )
        except json.JSONDecodeError:
            return self._fallback_result_from_evidence(
                evidence_package,
                "The model returned malformed JSON. The investigation is partial and should be treated as low confidence.",
            )

        return self._validate_result(result)

    def _sanitize_model_output(self, content: str) -> str:
        cleaned = content.strip()

        if "<think>" in cleaned.lower():
            cleaned = re.sub(
                r"(?is)<think>.*?</think>",
                " ",
                cleaned,
            )

        cleaned = cleaned.replace("\r", " ").replace(
            "\n",
            " ",
        )

        if cleaned.startswith("```"):
            cleaned = cleaned.strip("`")
            if cleaned.lower().startswith("json"):
                cleaned = cleaned[4:].lstrip()

        start = cleaned.find("{")
        end = cleaned.rfind("}")

        if start != -1 and end != -1 and end > start:
            cleaned = cleaned[start : end + 1]

        return cleaned.strip()

    def _fallback_result_from_evidence(
        self,
        evidence_package: dict[str, Any],
        message: str,
    ) -> dict[str, Any]:
        doc_evidence = evidence_package.get(
            "document_evidence",
            [],
        )
        evidence_sources = [
            item.get("source", "internal evidence")
            for item in doc_evidence[:3]
            if isinstance(item, dict)
        ]

        summary = (
            "The KPI trend shows a meaningful change in the current period, and the available evidence points to a mix of operational and demand-side drivers. "
            "The business should review the recent changes in the affected operating conditions before making a larger intervention."
        )

        return {
            "executive_summary": (
                "The KPI changed materially in the current period, and the evidence suggests the shift is being driven by operational and demand-side conditions. "
                "The business should review the recent trend and driver mix before scaling action, because the model output was not fully stable."
            ),
            "root_causes": [
                {
                    "cause": "Operational and demand conditions changed materially in the current period.",
                    "explanation": "The evidence package indicates a notable change in KPI performance, and the model output was incomplete, so the likely causes are being summarized conservatively.",
                    "supporting_evidence": evidence_sources or ["internal evidence"],
                    "confidence": "medium",
                }
            ],
            "recommendations": [
                {
                    "action": "Review the latest KPI trend and operational drivers with the stakeholders who own the affected business process.",
                    "rationale": "This is the most evidence-based next step while the model provides a lower-confidence summary.",
                    "priority": "high",
                }
            ],
            "confidence": "low",
            "ambiguity": message + " The model output was not stable enough to produce a fully reliable narrative, so the investigation should be treated as provisional.",
        }

    def _fallback_result(
        self,
        raw_content: str,
        message: str,
    ) -> dict[str, Any]:
        return {
            "executive_summary": (
                "The KPI changed materially in the current period and should be reviewed in context before committing to a broader operating response. "
                "The current evidence points to a meaningful shift, but confidence remains limited while the model response remains unstable."
            ),
            "root_causes": [],
            "recommendations": [
                {
                    "action": "Review the raw evidence package and re-run the investigation if needed.",
                    "rationale": "The model response was malformed, so confidence is intentionally low.",
                    "priority": "medium",
                }
            ],
            "confidence": "low",
            "ambiguity": message + " The model output was not valid JSON, so the investigation is incomplete.",
        }

    def _build_system_prompt(self) -> str:

        return """
You are the reasoning engine of
BusinessIntelligence.ai, an enterprise KPI
investigation system.

Your task is to transform an evidence package into
an executive-level business investigation.

IMPORTANT RULES:

1. Use only information contained in the evidence
   package.

2. Do not invent numbers, events, causes, documents,
   customers, products, or operational facts.

3. Do not claim causation merely because two variables
   are correlated.

4. Clearly distinguish:
   - observed facts
   - statistical relationships
   - likely explanations
   - uncertainty

5. If the evidence is insufficient, explicitly say so.

6. Recommendations must be connected to the evidence.

7. Do not recommend actions that require facts not
   present in the evidence.

8. Evidence references must use the exact source names
   provided in the evidence package.

9. Confidence must reflect the strength and consistency
   of the available evidence.

10. The final response must be concise enough for a
    business executive but sufficiently specific to
    explain the investigation.

Return ONLY valid JSON.

The JSON must have this structure:

{
  "executive_summary": "string",
  "root_causes": [
    {
      "cause": "string",
      "explanation": "string",
      "supporting_evidence": [
        "source name"
      ],
      "confidence": "high|medium|low"
    }
  ],
  "recommendations": [
    {
      "action": "string",
      "rationale": "string",
      "priority": "high|medium|low"
    }
  ],
  "confidence": "high|medium|low",
  "ambiguity": "string or null"
}
"""

    def _build_user_prompt(
        self,
        evidence_package: dict[str, Any],
    ) -> str:

        evidence_json = json.dumps(
            evidence_package,
            indent=2,
            ensure_ascii=False,
        )

        return f"""
Investigate the business KPI using the evidence
package below.

Your output should answer:

1. What changed?
2. Is the change unusual?
3. What are the most likely explanations?
4. What evidence supports each explanation?
5. What should the business do next?
6. What remains uncertain?

Do not introduce information outside the evidence.

EVIDENCE PACKAGE:

{evidence_json}
"""

    def _validate_result(
        self,
        result: dict[str, Any],
    ) -> dict[str, Any]:

        required_fields = [
            "executive_summary",
            "root_causes",
            "recommendations",
            "confidence",
            "ambiguity",
        ]

        for field in required_fields:
            if field not in result:
                raise RuntimeError(
                    f"LLM response missing field: "
                    f"{field}"
                )

        if result["confidence"] not in {
            "high",
            "medium",
            "low",
        }:
            result["confidence"] = "low"

        return result