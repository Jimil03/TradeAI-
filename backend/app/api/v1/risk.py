from decimal import Decimal

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.trade import Trade
from app.models.user import User
from app.schemas.risk import (
    PositionSizeRequest,
    PositionSizeResponse,
    RiskSettingsUpdate,
    RiskSettingsResponse,
)
from app.services.risk import suggested_position_size, build_risk_report

router = APIRouter(prefix="/api/v1/risk", tags=["risk"])


@router.get("/settings", response_model=RiskSettingsResponse)
def get_settings(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/settings", response_model=RiskSettingsResponse)
def update_settings(
    payload: RiskSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if payload.account_balance is not None:
        current_user.account_balance = payload.account_balance
    if payload.max_risk_per_trade_pct is not None:
        current_user.max_risk_per_trade_pct = payload.max_risk_per_trade_pct
    if payload.max_daily_risk_pct is not None:
        current_user.max_daily_risk_pct = payload.max_daily_risk_pct

    db.commit()
    db.refresh(current_user)
    return current_user


@router.post("/position-size", response_model=PositionSizeResponse)
def position_size(
    payload: PositionSizeRequest,
    current_user: User = Depends(get_current_user),
):
    risk_pct = payload.risk_pct if payload.risk_pct is not None else Decimal(str(current_user.max_risk_per_trade_pct))
    account_balance = Decimal(str(current_user.account_balance))

    qty = suggested_position_size(account_balance, risk_pct, payload.entry_price, payload.stop_loss)
    risk_amount = account_balance * (risk_pct / Decimal("100"))

    return PositionSizeResponse(
        suggested_quantity=qty,
        risk_amount=risk_amount,
        risk_pct_used=risk_pct,
    )


@router.get("/report")
def risk_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    trades = db.query(Trade).filter(Trade.user_id == current_user.id).all()
    return build_risk_report(current_user, trades)