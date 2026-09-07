from decimal import Decimal
from pydantic import BaseModel


class PositionSizeRequest(BaseModel):
    entry_price: Decimal
    stop_loss: Decimal
    risk_pct: Decimal | None = None  # falls back to user's max_risk_per_trade_pct if omitted


class PositionSizeResponse(BaseModel):
    suggested_quantity: Decimal
    risk_amount: Decimal
    risk_pct_used: Decimal


class RiskSettingsUpdate(BaseModel):
    account_balance: Decimal | None = None
    max_risk_per_trade_pct: Decimal | None = None
    max_daily_risk_pct: Decimal | None = None


class RiskSettingsResponse(BaseModel):
    account_balance: Decimal
    max_risk_per_trade_pct: Decimal
    max_daily_risk_pct: Decimal