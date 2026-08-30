from app.core.config import settings
from app.services.llm_service import LLMService


def test_llm_service_falls_back_without_groq_key(monkeypatch):
    monkeypatch.setattr(settings, "groq_api_key", "")

    service = LLMService()
    result = service.generate_investigation({"document_evidence": []})

    assert result["confidence"] == "low"
    assert "executive_summary" in result
    assert "root_causes" in result
    assert "recommendations" in result
