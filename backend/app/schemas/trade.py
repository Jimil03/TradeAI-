import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel


class TradeCreate(BaseModel):
    symbol: str
    exchange: str | None = None
    asset_type: str = "equity"
    direction: str  # LONG or SHORT

    quantity: Decimal
    entry_price: Decimal
    exit_price: Decimal | None = None

    entry_time: datetime
    exit_time: datetime | None = None

    stop_loss: Decimal | None = None
    target: Decimal | None = None
    fees: Decimal = Decimal("0")
    taxes: Decimal = Decimal("0")

    notes: str | None = None
    strategy: str | None = None
    source: str = "manual"


class TradeResponse(TradeCreate):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True