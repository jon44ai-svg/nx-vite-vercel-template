from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_port: int = 8000
    app_env: str = "development"
    log_level: str = "INFO"
    database_url: str = "sqlite:///./api-python.sqlite"
    jwt_secret: str = "dev-only-jwt-secret-change-me-please"
    jwt_expires_in_seconds: int = 3600
    cors_origin: str = "http://localhost:4200"
    admin_email: str = "admin@example.com"
    admin_password: str = "Admin123!"
    admin_name: str = "Template Admin"


@lru_cache
def get_settings() -> Settings:
    return Settings()
