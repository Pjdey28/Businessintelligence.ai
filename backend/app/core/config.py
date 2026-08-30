from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "BusinessIntelligence.ai"
    app_env: str = "development"
    api_prefix: str = "/api"

    groq_api_key: str = ""
    groq_model: str = "qwen/qwen3.6-27b"

    data_path: str = "../data/business_data_synthetic.csv"
    document_path: str = "../data/documents"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


settings = Settings()