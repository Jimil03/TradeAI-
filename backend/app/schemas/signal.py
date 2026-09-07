from pydantic import BaseModel


class SignalResponse(BaseModel):
    symbol: str
    data_available: bool
    direction_probability_up: float | None
    direction_probability_down: float | None
    confidence_level: str
    key_factors: list[str]
    volatility_atr: float | None = None
    disclaimer: str
    message: str | None = None