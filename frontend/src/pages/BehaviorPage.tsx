import { useState } from "react"
import { useAsync } from "../hooks/useAsync"
import { behaviorService } from "../services/insights"
import { Button, LoadingState, ErrorState, EmptyState, Card } from "../components/ui"

const severityColor: Record<string, string> = {
  low: "text-chalk-dim",
  medium: "text-signal",
  high: "text-loss",
}

function BehaviorPage() {
  const events = useAsync(() => behaviorService.listEvents(), [])
  const [analyzing, setAnalyzing] = useState(false)

  async function runAnalysis() {
    setAnalyzing(true)
    try {
      await behaviorService.analyze()
      events.refetch()
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-chalk">Behavior</h1>
          <p className="mt-1 text-sm text-chalk-dim">
            Deterministic pattern detection — possibilities, not verdicts.
          </p>
        </div>
        <Button onClick={runAnalysis} disabled={analyzing}>
          {analyzing ? "Analyzing..." : "Run analysis"}
        </Button>
      </div>

      <div className="mt-6">
        {events.loading ? (
          <LoadingState />
        ) : events.error ? (
          <ErrorState message={events.error} onRetry={events.refetch} />
        ) : events.data && events.data.length > 0 ? (
          <div className="space-y-3">
            {events.data.map((e) => (
              <Card key={e.id}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-wider text-chalk-dim">
                    {e.event_type}
                  </span>
                  <span className={`font-mono text-xs uppercase ${severityColor[e.severity] ?? "text-chalk-dim"}`}>
                    {e.severity} · {Math.round(e.confidence * 100)}% confidence
                  </span>
                </div>
                <p className="mt-2 text-sm text-chalk">{e.explanation}</p>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState message="No patterns flagged yet. Click 'Run analysis' to check your trades." />
        )}
      </div>
    </div>
  )
}

export default BehaviorPage
