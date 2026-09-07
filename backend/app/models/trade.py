import uuid
from datetime import datetime, timezone

from sqlalchemy import String, DateTime, Numeric, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Trade(Base):
    __tablename__ = "trades"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )

    symbol: Mapped[str] = mapped_column(String(50), nullable=False)
    exchange: Mapped[str | None] = mapped_column(String(50), nullable=True)
    asset_type: Mapped[str] = mapped_column(String(20), nullable=False, default="equity")
    direction: Mapped[str] = mapped_column(String(10), nullable=False)  # LONG or SHORT

    quantity: Mapped[float] = mapped_column(Numeric(18, 4), nullable=False)
    entry_price: Mapped[float] = mapped_column(Numeric(18, 4), nullable=False)
    exit_price: Mapped[float | None] = mapped_column(Numeric(18, 4), nullable=True)

    entry_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    exit_time: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    stop_loss: Mapped[float | None] = mapped_column(Numeric(18, 4), nullable=True)
    target: Mapped[float | None] = mapped_column(Numeric(18, 4), nullable=True)
    fees: Mapped[float] = mapped_column(Numeric(18, 4), nullable=False, default=0)
    taxes: Mapped[float] = mapped_column(Numeric(18, 4), nullable=False, default=0)

    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    strategy: Mapped[str | None] = mapped_column(String(100), nullable=True)
    source: Mapped[str] = mapped_column(String(50), nullable=False, default="manual")
    dedupe_hash: Mapped[str] = mapped_column(String(64), nullable=False, index=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )