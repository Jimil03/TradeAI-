import json
from decimal import Decimal
from statistics import mean

from app.models.trade import Trade


def _trade_pnl(trade: Trade) -> Decimal:
    if trade.exit_price is None:
        return Decimal("0")
    if trade.direction == "LONG":
        gross = (trade.exit_price - trade.entry_price) * trade.quantity
    else:
        gross = (trade.entry_price - trade.exit_price) * trade.quantity
    return gross - (trade.fees or Decimal("0")) - (trade.taxes or Decimal("0"))


def detect_overtrading(trades: list[Trade], threshold: int = 5) -> list[dict]:
    """Flags days with more trades than the threshold."""
    events = []
    by_day: dict[str, list[Trade]] = {}
    for t in trades:
        day = t.entry_time.date().isoformat()
        by_day.setdefault(day, []).append(t)

    for day, day_trades in by_day.items():
        if len(day_trades) > threshold:
            events.append({
                "event_type": "OVERTRADING",
                "severity": "medium" if len(day_trades) <= threshold + 3 else "high",
                "confidence": 0.7,
                "trigger_data": {"date": day, "trade_count": len(day_trades)},
                "explanation": f"Possible overtrading pattern detected: {len(day_trades)} trades placed on {day}, above your typical volume.",
                "trade_id": None,
            })
    return events


def detect_oversizing(trades: list[Trade], multiplier: Decimal = Decimal("2.0")) -> list[dict]:
    """Flags individual trades with quantity well above the user's average."""
    if len(trades) < 3:
        return []

    avg_qty = mean([t.quantity for t in trades])
    events = []
    for t in trades:
        if t.quantity > avg_qty * multiplier:
            events.append({
                "event_type": "OVERSIZING",
                "severity": "medium",
                "confidence": 0.65,
                "trigger_data": {"quantity": str(t.quantity), "average_quantity": str(avg_qty)},
                "explanation": f"Possible oversizing detected: this trade's size ({t.quantity}) is more than {multiplier}x your average ({avg_qty:.2f}).",
                "trade_id": str(t.id),
            })
    return events


def detect_revenge_trading(trades: list[Trade], window_minutes: int = 30) -> list[dict]:
    """Flags a trade opened shortly after a loss, with larger size than the losing trade."""
    ordered = sorted(trades, key=lambda t: t.entry_time)
    events = []
    for i in range(1, len(ordered)):
        prev, curr = ordered[i - 1], ordered[i]
        if prev.exit_price is None or _trade_pnl(prev) >= 0:
            continue
        gap_minutes = (curr.entry_time - prev.entry_time).total_seconds() / 60
        if gap_minutes <= window_minutes and curr.quantity > prev.quantity:
            events.append({
                "event_type": "REVENGE_TRADING",
                "severity": "high",
                "confidence": 0.6,
                "trigger_data": {
                    "previous_trade_id": str(prev.id),
                    "minutes_after_loss": round(gap_minutes, 1),
                },
                "explanation": f"Possible revenge-trading pattern detected: a larger trade was opened {gap_minutes:.0f} minutes after a loss.",
                "trade_id": str(curr.id),
            })
    return events


def detect_excessive_risk(trades: list[Trade], risk_threshold_pct: Decimal = Decimal("2.0")) -> list[dict]:
    """Flags trades with no stop loss set, or risk-per-trade that looks unusually large relative to entry value."""
    events = []
    for t in trades:
        if t.stop_loss is None:
            events.append({
                "event_type": "EXCESSIVE_RISK",
                "severity": "low",
                "confidence": 0.5,
                "trigger_data": {"reason": "no_stop_loss"},
                "explanation": "Possible excessive-risk pattern detected: this trade has no stop loss set.",
                "trade_id": str(t.id),
            })
            continue

        risk_per_unit = abs(t.entry_price - t.stop_loss)
        risk_pct = (risk_per_unit / t.entry_price) * 100 if t.entry_price else Decimal("0")
        if risk_pct > risk_threshold_pct * 3:  # 3x a "normal" 2% risk = 6%+ move to stop
            events.append({
                "event_type": "EXCESSIVE_RISK",
                "severity": "medium",
                "confidence": 0.6,
                "trigger_data": {"risk_pct": str(round(risk_pct, 2))},
                "explanation": f"Possible excessive-risk pattern detected: stop loss implies a {risk_pct:.1f}% risk on entry price, wider than typical.",
                "trade_id": str(t.id),
            })
    return events


def detect_loss_streak_behavior(trades: list[Trade], streak_threshold: int = 3) -> list[dict]:
    """Flags when a losing streak of a given length occurs, ending on the trade that completes it."""
    ordered = sorted([t for t in trades if t.exit_price is not None], key=lambda t: t.entry_time)
    events = []
    current_streak: list[Trade] = []

    for t in ordered:
        if _trade_pnl(t) < 0:
            current_streak.append(t)
        else:
            current_streak = []
            continue

        if len(current_streak) == streak_threshold:
            events.append({
                "event_type": "LOSS_STREAK_BEHAVIOR",
                "severity": "medium",
                "confidence": 0.75,
                "trigger_data": {"streak_length": streak_threshold},
                "explanation": f"Possible loss-streak pattern detected: {streak_threshold} consecutive losing trades.",
                "trade_id": str(t.id),
            })
    return events


def run_all_detectors(trades: list[Trade]) -> list[dict]:
    events = []
    events += detect_overtrading(trades)
    events += detect_oversizing(trades)
    events += detect_revenge_trading(trades)
    events += detect_excessive_risk(trades)
    events += detect_loss_streak_behavior(trades)

    for e in events:
        e["trigger_data"] = json.dumps(e["trigger_data"])

    return events