from fastapi import APIRouter, Depends

from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.signal import SignalResponse
from app.services.signal_engine import generate_signal

router = APIRouter(prefix="/api/v1/signal", tags=["signal"])


@router.get("/{symbol}", response_model=SignalResponse)
def get_signal(symbol: str, current_user: User = Depends(get_current_user)):
    return generate_signal(symbol)