from datetime import datetime, timezone, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.ai_usage import AIUsage
from app.schemas.ai import CoachResponse
from app.services.ai_coach import generate_coach_response

router = APIRouter(prefix="/api/v1/ai", tags=["ai"])

DAILY_FREE_LIMIT = 5


@router.post("/coach", response_model=CoachResponse)
def coach(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    since = datetime.now(timezone.utc) - timedelta(days=1)
    recent_count = (
        db.query(AIUsage)
        .filter(AIUsage.user_id == current_user.id, AIUsage.created_at >= since)
        .count()
    )
    if recent_count >= DAILY_FREE_LIMIT:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Daily AI coach limit reached ({DAILY_FREE_LIMIT}/day on the free plan).",
        )

    try:
        message, tokens_used = generate_coach_response(db, current_user)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=f"AI service error: {e}")

    usage = AIUsage(
        user_id=current_user.id,
        request_type="coach_summary",
        tokens_used=tokens_used,
        estimated_cost=0,  # Gemini free tier — real cost tracking added when billing milestone wires in paid tiers
    )
    db.add(usage)
    db.commit()

    return CoachResponse(message=message, tokens_used=tokens_used)