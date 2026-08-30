import json
import re
import os
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

        self.model = settings.groq_model
        self.client = None

        if not settings.groq_api_key:
            return

        self.client = Groq(
            api_key=settings.groq_api_key
        )

    def generate_investigation(
        self,
        evidence_package: dict[str, Any],
    ) -> dict[str, Any]:

        if self.client is None:
            return self._fallback_result_from_evidence(
                evidence_package,
                "GROQ_API_KEY is not configured, so the investigation is using a local evidence-only fallback.",
            )

        system_prompt = self._build_system_prompt()

        user_prompt = self._build_user_prompt(
            evidence_package
        )

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                temperature=0.1,
                max_tokens=6000,
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
        except Exception:
            return self._fallback_result_from_evidence(
                evidence_package,
                "The Groq API call failed, so the investigation is using a local evidence-only fallback.",
            )

        content = response.choices[0].message.content
        print("\n--- RAW QWEN OUTPUT ---")
        print(content)
        print("-----------------------\n")
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
            result = json.loads(sanitized_content)
        except json.JSONDecodeError:
            return self._fallback_result_from_evidence(
                evidence_package,
                "The model returned malformed JSON. The investigation is partial and should be treated as low confidence.",
            )

        return self._validate_result(result)

    def _sanitize_model_output(self, content: str) -> str:
            # 1. Aggressively delete the entire <think> block and everything inside it
            content = re.sub(r"(?is)<think>.*?</think>", "", content)
            
            # 2. Now find the first { and last } in the REMAINING text
            start = content.find("{")
            end = content.rfind("}")
            
            if start != -1 and end != -1 and end > start:
                # 3. Extract the clean JSON block
                cleaned = content[start : end + 1]
                return cleaned.strip()
                
            return content.strip()

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
You are a data processing API. You MUST output ONLY valid, raw JSON. 
CRITICAL RULES:
1. Do NOT output any conversational text, preamble, or markdown formatting (no ```json).
2. Start your final response immediately with the { character.

The JSON MUST have exactly this structure:
{
  "executive_summary": "Write a 2-3 sentence detailed summary of what changed here.",
  "root_causes": [
    {
      "cause": "Name the specific operational cause here.",
      "explanation": "Explain why this cause matters based on the evidence.",
      "supporting_evidence": [
        "source name"
      ],
      "confidence": "high"
    }
  ],
  "recommendations": [
    {
      "action": "Name the specific action to take.",
      "rationale": "Explain why this action will help.",
      "priority": "high"
    }
  ],
  "confidence": "high",
  "ambiguity": "Note any missing data or uncertainty here."
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
        if not isinstance(result, dict):
            raise RuntimeError(
                "LLM response was not a JSON object."
            )

        required_fields = [
            "executive_summary",
            "root_causes",
            "recommendations",
            "confidence",
            "ambiguity",
        ]

        for field in required_fields:
            value = result.get(field)

            if value is None:
                if field == "executive_summary":
                    result[field] = (
                        "The AI model did not generate a summary. "
                        "Please review the operational evidence."
                    )
                elif field == "ambiguity":
                    result[field] = "No ambiguity detected."
                else:
                    result[field] = [] if field in {"root_causes", "recommendations"} else "low"
                continue

            if isinstance(value, str) and value.strip() == "":
                if field == "executive_summary":
                    result[field] = (
                        "The AI model did not generate a summary. "
                        "Please review the operational evidence."
                    )
                elif field == "ambiguity":
                    result[field] = "No ambiguity detected."
                else:
                    result[field] = [] if field in {"root_causes", "recommendations"} else "low"
                continue

            if field in {"root_causes", "recommendations"} and not isinstance(value, list):
                result[field] = []

            if field == "confidence" and not isinstance(value, str):
                result[field] = "low"

        confidence = str(result.get("confidence", "low")).lower()
        if confidence not in {"high", "medium", "low"}:
            result["confidence"] = "low"
        else:
            result["confidence"] = confidence

        if not isinstance(result.get("ambiguity"), str):
            result["ambiguity"] = "No ambiguity detected."

        return result