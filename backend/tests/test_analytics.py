from datetime import datetime, timezone
from decimal import Decimal

from app.models.trade import Trade
from app.services.analytics import calculate_summary


def make_trade(direction, entry_price, exit_price, quantity=1, fees=0, taxes=0, stop_loss=None, target=None, entry_time=None):
    return Trade(
        symbol="TEST",
        direction=direction,
        quantity=Decimal(quantity),
        entry_price=Decimal(entry_price),
        exit_price=Decimal(exit_price) if exit_price is not None else None,
        entry_time=entry_time or datetime(2026, 1, 1, tzinfo=timezone.utc),
        fees=Decimal(fees),
        taxes=Decimal(taxes),
        stop_loss=Decimal(stop_loss) if stop_loss is not None else None,
        target=Decimal(target) if target is not None else None,
        dedupe_hash="test",
    )


def test_empty_trades_returns_zeroed_summary():
    result = calculate_summary([])
    assert result["closed_trades"] == 0
    assert result["net_pnl"] == Decimal("0")
    assert result["win_rate"] is None


def test_single_winning_long_trade():
    trades = [make_trade("LONG", 100, 110, quantity=10)]
    result = calculate_summary(trades)
    assert result["net_pnl"] == Decimal("100")  # (110-100)*10
    assert result["win_rate"] == Decimal("100")
    assert result["gross_profit"] == Decimal("100")
    assert result["gross_loss"] == Decimal("0")


def test_single_losing_short_trade():
    trades = [make_trade("SHORT", 100, 110, quantity=5)]
    result = calculate_summary(trades)
    assert result["net_pnl"] == Decimal("-50")  # (100-110)*5
    assert result["win_rate"] == Decimal("0")


def test_fees_and_taxes_reduce_pnl():
    trades = [make_trade("LONG", 100, 110, quantity=10, fees=5, taxes=2)]
    result = calculate_summary(trades)
    assert result["net_pnl"] == Decimal("93")  # 100 - 5 - 2


def test_profit_factor_and_expectancy():
    trades = [
        make_trade("LONG", 100, 110, quantity=1),  # +10
        make_trade("LONG", 100, 90, quantity=1),   # -10
        make_trade("LONG", 100, 120, quantity=1),  # +20
    ]
    result = calculate_summary(trades)
    assert result["net_pnl"] == Decimal("20")
    assert result["profit_factor"] == Decimal("3")  # 30 profit / 10 loss
    assert result["expectancy"] == Decimal("20") / 3


def test_open_trades_excluded_from_metrics():
    trades = [
        make_trade("LONG", 100, 110, quantity=1),
        make_trade("LONG", 100, None, quantity=1),  # still open
    ]
    result = calculate_summary(trades)
    assert result["total_trades"] == 2
    assert result["closed_trades"] == 1


def test_max_drawdown():
    trades = [
        make_trade("LONG", 100, 120, quantity=1, entry_time=datetime(2026, 1, 1, tzinfo=timezone.utc)),  # +20, equity=20
        make_trade("LONG", 100, 90, quantity=1, entry_time=datetime(2026, 1, 2, tzinfo=timezone.utc)),   # -10, equity=10
        make_trade("LONG", 100, 85, quantity=1, entry_time=datetime(2026, 1, 3, tzinfo=timezone.utc)),   # -15, equity=-5
    ]
    result = calculate_summary(trades)
    # peak was 20, lowest point after peak was -5 -> drawdown of 25
    assert result["max_drawdown"] == Decimal("25")


def test_win_and_loss_streaks():
    trades = [
        make_trade("LONG", 100, 110, entry_time=datetime(2026, 1, 1, tzinfo=timezone.utc)),  # win
        make_trade("LONG", 100, 110, entry_time=datetime(2026, 1, 2, tzinfo=timezone.utc)),  # win
        make_trade("LONG", 100, 90, entry_time=datetime(2026, 1, 3, tzinfo=timezone.utc)),   # loss
        make_trade("LONG", 100, 110, entry_time=datetime(2026, 1, 4, tzinfo=timezone.utc)),  # win
        make_trade("LONG", 100, 90, entry_time=datetime(2026, 1, 5, tzinfo=timezone.utc)),   # loss
        make_trade("LONG", 100, 90, entry_time=datetime(2026, 1, 6, tzinfo=timezone.utc)),   # loss
    ]
    result = calculate_summary(trades)
    assert result["longest_win_streak"] == 2
    assert result["longest_loss_streak"] == 2