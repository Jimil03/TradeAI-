from decimal import Decimal
from pydantic import BaseModel


class AnalyticsSummary(BaseModel):
    total_trades: int
    closed_trades: int
    win_rate: Decimal | None
    net_pnl: Decimal
    gross_profit: Decimal
    gross_loss: Decimal
    average_win: Decimal | None
    average_loss: Decimal | None
    profit_factor: Decimal | None
    expectancy: Decimal | None
    max_drawdown: Decimal
    average_risk_reward: Decimal | None
    longest_win_streak: int
    longest_loss_streak: int