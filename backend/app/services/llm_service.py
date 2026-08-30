import json
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
            response_format={
                "type": "json_object"
            },
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
        )

        content = response.choices[0].message.content

        if not content:
            raise RuntimeError(
                "LLM returned an empty response."
            )

        try:
            result = json.loads(content)
        except json.JSONDecodeError as exc:
            raise RuntimeError(
                "LLM returned invalid JSON."
            ) from exc

        return self._validate_result(result)

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