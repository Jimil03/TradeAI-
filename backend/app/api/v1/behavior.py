from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.trade import Trade
from app.models.behavior_event import BehaviorEvent
from app.models.user import User
from app.schemas.behavior import BehaviorEventResponse
from app.services.behavior import run_all_detectors

router = APIRouter(prefix="/api/v1/behavior", tags=["behavior"])


@router.post("/analyze", response_model=list[BehaviorEventResponse])
def analyze(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    trades = db.query(Trade).filter(Trade.user_id == current_user.id).all()
    detected = run_all_detectors(trades)

    # Clear previous auto-generated events for this user, then re-insert fresh ones.
    db.query(BehaviorEvent).filter(BehaviorEvent.user_id == current_user.id).delete()

    saved = []
    for e in detected:
        event = BehaviorEvent(
            user_id=current_user.id,
            trade_id=e["trade_id"],
            event_type=e["event_type"],
            severity=e["severity"],
            confidence=e["confidence"],
            trigger_data=e["trigger_data"],
            explanation=e["explanation"],
        )
        db.add(event)
        saved.append(event)

    db.commit()
    for event in saved:
        db.refresh(event)
    return saved


@router.get("/events", response_model=list[BehaviorEventResponse])
def list_events(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(BehaviorEvent)
        .filter(BehaviorEvent.user_id == current_user.id)
        .order_by(BehaviorEvent.created_at.desc())
        .all()
    )