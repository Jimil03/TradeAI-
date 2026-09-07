import { useState } from "react"
import { signalService } from "../services/insights"
import { Button, Input, Card, ErrorState, EmptyState } from "../components/ui"
import { ApiError } from "../services/api"
import type { SignalResponse } from "../types/api"

function SignalPage() {
  const [symbol, setSymbol] = useState("")
  const [result, setResult] = useState<SignalResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!symbol.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await signalService.getSignal(symbol.trim().toUpperCase())
      setResult(res)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not fetch signal")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-chalk">Stock Insight</h1>
      <p className="mt-1 max-w-xl text-sm text-chalk-dim">
        Educational insight based on historical price patterns and recent news sentiment.
        Not financial advice. Past patterns do not guarantee future results.
      </p>

      <form onSubmit={handleSearch} className="mt-6 flex max-w-sm gap-3">
        <Input
          placeholder="Symbol, e.g. AAPL"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Looking up..." : "Look up"}
        </Button>
      </form>

      <div className="mt-6">
        {error ? (
          <ErrorState message={error} />
        ) : result ? (
          result.data_available ? (
            <Card>
              <div className="flex items-center justify-between">
                <span className="font-mono text-lg text-chalk">{result.symbol}</span>
                <span className="font-mono text-xs uppercase tracking-wider text-chalk-dim">
                  Confidence: {result.confidence_level}
                </span>
              </div>

              <div className="mt-4">
                <div className="flex h-6 w-full overflow-hidden rounded-md">
                  <div
                    className="flex items-center justify-center bg-gain text-xs font-mono text-ink"
                    style={{ width: `${result.direction_probability_up}%` }}
                  >
                    {result.direction_probability_up}%
                  </div>
                  <div
                    className="flex items-center justify-center bg-loss text-xs font-mono text-ink"
                    style={{ width: `${result.direction_probability_down}%` }}
                  >
                    {result.direction_probability_down}%
                  </div>
                </div>
                <div className="mt-1 flex justify-between text-xs text-chalk-dim">
                  <span>Upward lean</span>
                  <span>Downward lean</span>
                </div>
              </div>

              {result.volatility_atr !== null && (
                <p className="mt-4 font-mono text-sm text-chalk-dim">
                  Average daily volatility (ATR): {result.volatility_atr}
                </p>
              )}

              <div className="mt-4">
                <p className="text-xs uppercase tracking-wider text-chalk-dim">Key factors</p>
                <ul className="mt-2 space-y-1 text-sm text-chalk">
                  {result.key_factors.map((f, i) => (
                    <li key={i}>— {f}</li>
                  ))}
                </ul>
              </div>

              <p className="mt-6 border-t border-white/10 pt-4 text-xs text-chalk-dim">
                {result.disclaimer}
              </p>
            </Card>
          ) : (
            <EmptyState message={result.message ?? "Data not available for this symbol."} />
          )
        ) : (
          <EmptyState message="Search a symbol to see its probability-based insight." />
        )}
      </div>
    </div>
  )
}

export default SignalPage