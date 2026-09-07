from decimal import Decimal
from app.models.trade import Trade


def _trade_pnl(trade: Trade) -> Decimal:
    """Realized P&L for a single closed trade, net of fees and taxes."""
    if trade.exit_price is None:
        return Decimal("0")

    if trade.direction == "LONG":
        gross = (trade.exit_price - trade.entry_price) * trade.quantity
    else:  # SHORT
        gross = (trade.entry_price - trade.exit_price) * trade.quantity

    return gross - (trade.fees or Decimal("0")) - (trade.taxes or Decimal("0"))


def calculate_summary(trades: list[Trade]) -> dict:
    closed = [t for t in trades if t.exit_price is not None]
    total_trades = len(trades)
    closed_trades = len(closed)

    if closed_trades == 0:
        return {
            "total_trades": total_trades,
            "closed_trades": 0,
            "win_rate": None,
            "net_pnl": Decimal("0"),
            "gross_profit": Decimal("0"),
            "gross_loss": Decimal("0"),
            "average_win": None,
            "average_loss": None,
            "profit_factor": None,
            "expectancy": None,
            "max_drawdown": Decimal("0"),
            "average_risk_reward": None,
            "longest_win_streak": 0,
            "longest_loss_streak": 0,
        }

    pnls = [_trade_pnl(t) for t in closed]
    wins = [p for p in pnls if p > 0]
    losses = [p for p in pnls if p < 0]

    win_rate = (Decimal(len(wins)) / Decimal(closed_trades)) * 100
    net_pnl = sum(pnls, Decimal("0"))
    gross_profit = sum(wins, Decimal("0"))
    gross_loss = sum(losses, Decimal("0"))  # negative value

    average_win = (gross_profit / len(wins)) if wins else None
    average_loss = (gross_loss / len(losses)) if losses else None

    profit_factor = (gross_profit / abs(gross_loss)) if gross_loss != 0 else None

    expectancy = net_pnl / closed_trades

    # Max drawdown from the equity curve, ordered by entry_time
    ordered = sorted(closed, key=lambda t: t.entry_time)
    equity = Decimal("0")
    peak = Decimal("0")
    max_drawdown = Decimal("0")
    for t in ordered:
        equity += _trade_pnl(t)
        if equity > peak:
            peak = equity
        drawdown = peak - equity
        if drawdown > max_drawdown:
            max_drawdown = drawdown

    # Risk/reward: average |target - entry| vs |entry - stop_loss|, only where both are set
    rr_ratios = []
    for t in closed:
        if t.stop_loss is not None and t.target is not None:
            risk = abs(t.entry_price - t.stop_loss)
            reward = abs(t.target - t.entry_price)
            if risk > 0:
                rr_ratios.append(reward / risk)
    average_risk_reward = (sum(rr_ratios, Decimal("0")) / len(rr_ratios)) if rr_ratios else None

    # Streaks, in chronological order
    longest_win_streak = 0
    longest_loss_streak = 0
    current_win = 0
    current_loss = 0
    for t in ordered:
        pnl = _trade_pnl(t)
        if pnl > 0:
            current_win += 1
            current_loss = 0
        elif pnl < 0:
            current_loss += 1
            current_win = 0
        else:
            current_win = 0
            current_loss = 0
        longest_win_streak = max(longest_win_streak, current_win)
        longest_loss_streak = max(longest_loss_streak, current_loss)

    return {
        "total_trades": total_trades,
        "closed_trades": closed_trades,
        "win_rate": win_rate,
        "net_pnl": net_pnl,
        "gross_profit": gross_profit,
        "gross_loss": gross_loss,
        "average_win": average_win,
        "average_loss": average_loss,
        "profit_factor": profit_factor,
        "expectancy": expectancy,
        "max_drawdown": max_drawdown,
        "average_risk_reward": average_risk_reward,
        "longest_win_streak": longest_win_streak,
        "longest_loss_streak": longest_loss_streak,
    }