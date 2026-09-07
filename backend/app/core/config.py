from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    environment: str = "development"
    jwt_secret: str
    gemini_api_key: str
    cors_origins: str = "http://localhost:5173"
    finnhub_api_key: str
    alpha_vantage_api_key: str

    class Config:
        env_file = ".env"

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()