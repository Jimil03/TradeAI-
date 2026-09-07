import json
from decimal import Decimal

import google.generativeai as genai
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.trade import Trade
from app.models.user import User
from app.services.analytics import calculate_summary
from app.services.behavior import run_all_detectors
from app.services.risk import build_risk_report

genai.configure(api_key=settings.gemini_api_key)

SYSTEM_PROMPT = """You are TradeMind AI's trading coach. You explain numbers that have already been calculated by a separate backend system. You must follow these rules strictly:
- Never invent, estimate, or restate a number differently than what is given to you in the data below.
- Never guarantee future profits or predict specific price movements.
- Never claim certainty about the trader's psychological state. Use cautious language like "this may suggest" rather than "you are".
- Keep your response educational, concise (under 200 words), and supportive but honest.
- If the data shows a concerning pattern, name it plainly but without alarm.
"""


def _decimal_default(obj):
    if isinstance(obj, Decimal):
        return str(obj)
    return str(obj)


def build_context(db: Session, user: User) -> dict:
    trades = db.query(Trade).filter(Trade.user_id == user.id).all()

    summary = calculate_summary(trades)
    behavior_events = run_all_detectors(trades)
    risk_report = build_risk_report(user, trades)

    return {
        "analytics_summary": summary,
        "behavior_flags": [
            {"event_type": e["event_type"], "severity": e["severity"], "explanation": e["explanation"]}
            for e in behavior_events
        ],
        "risk_report": {
            "account_balance": risk_report["account_balance"],
            "max_risk_per_trade_pct": risk_report["max_risk_per_trade_pct"],
            "trades_exceeding_per_trade_limit": len(risk_report["trades_exceeding_per_trade_limit"]),
        },
    }


def generate_coach_response(db: Session, user: User) -> tuple[str, int]:
    context = build_context(db, user)
    context_json = json.dumps(context, default=_decimal_default, indent=2)

    model = genai.GenerativeModel(
        model_name="gemini-3.6-flash",
        system_instruction=SYSTEM_PROMPT,
    )
    prompt = f"Here is the trader's current data:\n\n{context_json}\n\nExplain what this means for them."

    response = model.generate_content(prompt)

    text = response.text
    tokens_used = 0
    if hasattr(response, "usage_metadata") and response.usage_metadata:
        tokens_used = response.usage_metadata.total_token_count

    return text, tokens_used