import uuid
from datetime import datetime

from pydantic import BaseModel


class BehaviorEventResponse(BaseModel):
    id: uuid.UUID
    trade_id: uuid.UUID | None
    event_type: str
    severity: str
    confidence: float
    trigger_data: str | None
    explanation: str
    created_at: datetime

    class Config:
        from_attributes = True