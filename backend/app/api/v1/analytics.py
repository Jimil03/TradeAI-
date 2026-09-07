from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.trade import Trade
from app.models.user import User
from app.schemas.analytics import AnalyticsSummary
from app.services.analytics import calculate_summary

router = APIRouter(prefix="/api/v1/analytics", tags=["analytics"])


@router.get("/summary", response_model=AnalyticsSummary)
def get_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    trades = db.query(Trade).filter(Trade.user_id == current_user.id).all()
    return calculate_summary(trades)