import { useAsync } from "../hooks/useAsync"
import { analyticsService } from "../services/insights"
import { StatCard, LoadingState, ErrorState } from "../components/ui"

function AnalyticsPage() {
  const summary = useAsync(() => analyticsService.getSummary(), [])

  if (summary.loading) return <LoadingState />
  if (summary.error) return <ErrorState message={summary.error} onRetry={summary.refetch} />

  const s = summary.data!

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-chalk">Analytics</h1>
      <p className="mt-1 text-sm text-chalk-dim">
        Calculated from {s.closed_trades} closed trades out of {s.total_trades} total.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Net P&L" value={s.net_pnl} tone={Number(s.net_pnl) >= 0 ? "gain" : "loss"} />
        <StatCard label="Gross Profit" value={s.gross_profit} tone="gain" />
        <StatCard label="Gross Loss" value={s.gross_loss} tone="loss" />
        <StatCard label="Win Rate" value={s.win_rate ? `${Number(s.win_rate).toFixed(1)}%` : "—"} />
        <StatCard label="Average Win" value={s.average_win ?? "—"} tone="gain" />
        <StatCard label="Average Loss" value={s.average_loss ?? "—"} tone="loss" />
        <StatCard label="Profit Factor" value={s.profit_factor ?? "—"} />
        <StatCard label="Expectancy" value={s.expectancy ?? "—"} />
        <StatCard label="Max Drawdown" value={s.max_drawdown} tone="loss" />
        <StatCard label="Avg Risk/Reward" value={s.average_risk_reward ?? "—"} />
        <StatCard label="Longest Win Streak" value={String(s.longest_win_streak)} tone="gain" />
        <StatCard label="Longest Loss Streak" value={String(s.longest_loss_streak)} tone="loss" />
      </div>
    </div>
  )
}

export default AnalyticsPage
