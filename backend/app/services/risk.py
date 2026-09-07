from datetime import date
from decimal import Decimal

from app.models.trade import Trade
from app.models.user import User


def suggested_position_size(account_balance: Decimal, risk_pct: Decimal, entry_price: Decimal, stop_loss: Decimal) -> Decimal:
    """How many units to buy/sell so that a stop-out risks exactly risk_pct of account_balance."""
    if entry_price == stop_loss:
        return Decimal("0")
    risk_amount = account_balance * (risk_pct / Decimal("100"))
    risk_per_unit = abs(entry_price - stop_loss)
    if risk_per_unit == 0:
        return Decimal("0")
    return (risk_amount / risk_per_unit).quantize(Decimal("0.0001"))


def trade_risk_amount(trade: Trade) -> Decimal | None:
    """Rupee/dollar amount at risk on a single trade, based on its own stop loss."""
    if trade.stop_loss is None:
        return None
    risk_per_unit = abs(trade.entry_price - trade.stop_loss)
    return risk_per_unit * trade.quantity


def trade_risk_pct_of_account(trade: Trade, account_balance: Decimal) -> Decimal | None:
    if account_balance == 0:
        return None
    amount = trade_risk_amount(trade)
    if amount is None:
        return None
    return (amount / account_balance) * 100


def daily_risk_summary(trades: list[Trade], account_balance: Decimal, max_daily_risk_pct: Decimal) -> list[dict]:
    """Groups open-risk trades by day and flags days where combined risk exceeds the daily limit."""
    by_day: dict[date, list[Trade]] = {}
    for t in trades:
        day = t.entry_time.date()
        by_day.setdefault(day, []).append(t)

    summary = []
    for day, day_trades in sorted(by_day.items()):
        total_risk = Decimal("0")
        for t in day_trades:
            amount = trade_risk_amount(t)
            if amount is not None:
                total_risk += amount

        risk_pct = (total_risk / account_balance * 100) if account_balance > 0 else Decimal("0")
        summary.append({
            "date": day.isoformat(),
            "trade_count": len(day_trades),
            "total_risk_amount": total_risk,
            "risk_pct_of_account": risk_pct,
            "exceeds_daily_limit": risk_pct > max_daily_risk_pct,
        })
    return summary


def current_exposure(trades: list[Trade]) -> dict:
    """Open positions (no exit yet): total notional value and count, by symbol."""
    open_trades = [t for t in trades if t.exit_price is None]
    by_symbol: dict[str, Decimal] = {}
    total_notional = Decimal("0")

    for t in open_trades:
        notional = t.entry_price * t.quantity
        total_notional += notional
        by_symbol[t.symbol] = by_symbol.get(t.symbol, Decimal("0")) + notional

    return {
        "open_trade_count": len(open_trades),
        "total_notional_exposure": total_notional,
        "exposure_by_symbol": {k: str(v) for k, v in by_symbol.items()},
    }


def build_risk_report(user: User, trades: list[Trade]) -> dict:
    account_balance = Decimal(str(user.account_balance))
    max_daily_risk_pct = Decimal(str(user.max_daily_risk_pct))
    max_risk_per_trade_pct = Decimal(str(user.max_risk_per_trade_pct))

    per_trade_flags = []
    for t in trades:
        pct = trade_risk_pct_of_account(t, account_balance)
        if pct is not None and pct > max_risk_per_trade_pct:
            per_trade_flags.append({
                "trade_id": str(t.id),
                "symbol": t.symbol,
                "risk_pct_of_account": pct,
                "max_allowed_pct": max_risk_per_trade_pct,
            })

    return {
        "account_balance": account_balance,
        "max_risk_per_trade_pct": max_risk_per_trade_pct,
        "max_daily_risk_pct": max_daily_risk_pct,
        "trades_exceeding_per_trade_limit": per_trade_flags,
        "daily_risk": daily_risk_summary(trades, account_balance, max_daily_risk_pct),
        "exposure": current_exposure(trades),
    }