import { useAsync } from "../hooks/useAsync"
import { analyticsService, behaviorService } from "../services/insights"
import { tradesService } from "../services/trades"
import { StatCard, LoadingState, ErrorState, EmptyState, Card } from "../components/ui"

function DashboardPage() {
  const summary = useAsync(() => analyticsService.getSummary(), [])
  const trades = useAsync(() => tradesService.list(), [])
  const events = useAsync(() => behaviorService.listEvents(), [])

  if (summary.loading || trades.loading) return <LoadingState />
  if (summary.error) return <ErrorState message={summary.error} onRetry={summary.refetch} />

  const s = summary.data!

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-chalk">Overview</h1>
      <p className="mt-1 text-sm text-chalk-dim">
        {s.total_trades} trades logged, {s.closed_trades} closed.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Net P&L" value={s.net_pnl} tone={Number(s.net_pnl) >= 0 ? "gain" : "loss"} />
        <StatCard label="Win Rate" value={s.win_rate ? `${Number(s.win_rate).toFixed(1)}%` : "—"} />
        <StatCard label="Profit Factor" value={s.profit_factor ?? "—"} />
        <StatCard label="Max Drawdown" value={s.max_drawdown} tone="loss" />
      </div>

      <div className="mt-8">
        <h2 className="font-display text-lg font-semibold text-chalk">Recent behavior flags</h2>
        <Card className="mt-3">
          {events.loading ? (
            <LoadingState />
          ) : events.error ? (
            <ErrorState message={events.error} />
          ) : events.data && events.data.length > 0 ? (
            <ul className="space-y-3">
              {events.data.slice(0, 5).map((e) => (
                <li key={e.id} className="text-sm text-chalk-dim">
                  <span className="font-mono text-xs uppercase text-signal">{e.event_type}</span>
                  <p className="mt-1">{e.explanation}</p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState message="No behavior flags yet. Run an analysis from the Behavior tab." />
          )}
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage
