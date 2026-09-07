import uuid
from datetime import datetime, timezone

from sqlalchemy import String, DateTime, ForeignKey, Text, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class BehaviorEvent(Base):
    __tablename__ = "behavior_events"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )
    trade_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("trades.id"), nullable=True, index=True
    )

    event_type: Mapped[str] = mapped_column(String(50), nullable=False)
    # REVENGE_TRADING | OVERTRADING | OVERSIZING | EXCESSIVE_RISK | LOSS_STREAK_BEHAVIOR
    severity: Mapped[str] = mapped_column(String(20), nullable=False)  # low | medium | high
    confidence: Mapped[float] = mapped_column(Numeric(3, 2), nullable=False)  # 0.00-1.00

    trigger_data: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON string
    explanation: Mapped[str] = mapped_column(Text, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )