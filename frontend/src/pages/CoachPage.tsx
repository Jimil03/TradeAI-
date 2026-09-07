import { useState } from "react"
import { aiService } from "../services/insights"
import { Button, Card, ErrorState, EmptyState } from "../components/ui"
import { ApiError } from "../services/api"

function CoachPage() {
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function ask() {
    setLoading(true)
    setError(null)
    try {
      const res = await aiService.askCoach()
      setMessage(res.message)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reach the AI coach")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-chalk">AI Coach</h1>
      <p className="mt-1 max-w-xl text-sm text-chalk-dim">
        The coach explains numbers already calculated by TradeMind's backend. It never invents
        statistics, predicts prices, or guarantees outcomes — it's an educational tool, not
        financial advice.
      </p>

      <div className="mt-6">
        <Button onClick={ask} disabled={loading}>
          {loading ? "Thinking..." : "Ask the coach"}
        </Button>
      </div>

      <div className="mt-6">
        {error ? (
          <ErrorState message={error} onRetry={ask} />
        ) : message ? (
          <Card>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-chalk">{message}</p>
          </Card>
        ) : (
          <EmptyState message="Ask the coach to get an explanation of your current numbers." />
        )}
      </div>
    </div>
  )
}

export default CoachPage
