import { useState, useEffect } from "react"
import { useAsync } from "../hooks/useAsync"
import { riskService } from "../services/insights"
import { Button, Input, LoadingState, ErrorState, StatCard, Card, EmptyState } from "../components/ui"
import type { RiskSettings, PositionSizeResult } from "../types/api"
import { ApiError } from "../services/api"

function RiskPage() {
  const settingsAsync = useAsync(() => riskService.getSettings(), [])
  const reportAsync = useAsync(() => riskService.getReport(), [])

  const [settings, setSettings] = useState<RiskSettings | null>(null)
  const [savingSettings, setSavingSettings] = useState(false)
  const [settingsMsg, setSettingsMsg] = useState<string | null>(null)

  const [entryPrice, setEntryPrice] = useState("")
  const [stopLoss, setStopLoss] = useState("")
  const [sizeResult, setSizeResult] = useState<PositionSizeResult | null>(null)
  const [sizeError, setSizeError] = useState<string | null>(null)
  const [sizing, setSizing] = useState(false)

  useEffect(() => {
    if (settingsAsync.data) setSettings(settingsAsync.data)
  }, [settingsAsync.data])

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault()
    if (!settings) return
    setSavingSettings(true)
    setSettingsMsg(null)
    try {
      await riskService.updateSettings(settings)
      setSettingsMsg("Saved.")
      reportAsync.refetch()
    } catch (err) {
      setSettingsMsg(err instanceof ApiError ? err.message : "Could not save settings")
    } finally {
      setSavingSettings(false)
    }
  }

  async function calculateSize(e: React.FormEvent) {
    e.preventDefault()
    setSizeError(null)
    setSizing(true)
    try {
      const result = await riskService.positionSize(entryPrice, stopLoss)
      setSizeResult(result)
    } catch (err) {
      setSizeError(err instanceof ApiError ? err.message : "Could not calculate position size")
    } finally {
      setSizing(false)
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-chalk">Risk</h1>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="font-display text-lg font-semibold text-chalk">Settings</h2>
          {settingsAsync.loading ? (
            <LoadingState />
          ) : settingsAsync.error ? (
            <ErrorState message={settingsAsync.error} onRetry={settingsAsync.refetch} />
          ) : settings ? (
            <form onSubmit={saveSettings} className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs text-chalk-dim">Account balance</label>
                <Input
                  type="number"
                  value={settings.account_balance}
                  onChange={(e) => setSettings({ ...settings, account_balance: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-chalk-dim">Max risk per trade (%)</label>
                <Input
                  type="number"
                  value={settings.max_risk_per_trade_pct}
                  onChange={(e) => setSettings({ ...settings, max_risk_per_trade_pct: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-chalk-dim">Max daily risk (%)</label>
                <Input
                  type="number"
                  value={settings.max_daily_risk_pct}
                  onChange={(e) => setSettings({ ...settings, max_daily_risk_pct: e.target.value })}
                />
              </div>
              {settingsMsg && <p className="text-sm text-chalk-dim">{settingsMsg}</p>}
              <Button type="submit" disabled={savingSettings}>
                {savingSettings ? "Saving..." : "Save settings"}
              </Button>
            </form>
          ) : null}
        </Card>

        <Card>
          <h2 className="font-display text-lg font-semibold text-chalk">Position size calculator</h2>
          <form onSubmit={calculateSize} className="mt-4 space-y-3">
            <div>
              <label className="mb-1 block text-xs text-chalk-dim">Entry price</label>
              <Input
                type="number"
                required
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-chalk-dim">Stop loss</label>
              <Input
                type="number"
                required
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
              />
            </div>
            {sizeError && <p className="text-sm text-loss">{sizeError}</p>}
            <Button type="submit" disabled={sizing}>
              {sizing ? "Calculating..." : "Calculate"}
            </Button>
          </form>
          {sizeResult && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <StatCard label="Suggested qty" value={sizeResult.suggested_quantity} />
              <StatCard label="Risk amount" value={sizeResult.risk_amount} />
            </div>
          )}
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-lg font-semibold text-chalk">Exposure &amp; daily risk</h2>
        {reportAsync.loading ? (
          <LoadingState />
        ) : reportAsync.error ? (
          <ErrorState message={reportAsync.error} onRetry={reportAsync.refetch} />
        ) : reportAsync.data ? (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <StatCard
                label="Open positions"
                value={String(reportAsync.data.exposure.open_trade_count)}
              />
              <StatCard
                label="Total exposure"
                value={reportAsync.data.exposure.total_notional_exposure}
              />
              <StatCard
                label="Trades over per-trade limit"
                value={String(reportAsync.data.trades_exceeding_per_trade_limit.length)}
                tone={reportAsync.data.trades_exceeding_per_trade_limit.length > 0 ? "loss" : "neutral"}
              />
            </div>
            {reportAsync.data.daily_risk.length > 0 ? (
              <Card>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-chalk-dim">
                      <th className="pb-2 font-normal">Date</th>
                      <th className="pb-2 font-normal">Trades</th>
                      <th className="pb-2 font-normal">Risk amount</th>
                      <th className="pb-2 font-normal">% of account</th>
                      <th className="pb-2 font-normal">Status</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    {reportAsync.data.daily_risk.map((d) => (
                      <tr key={d.date} className="border-b border-white/5">
                        <td className="py-2 text-chalk-dim">{d.date}</td>
                        <td className="py-2 text-chalk-dim">{d.trade_count}</td>
                        <td className="py-2 text-chalk-dim">{d.total_risk_amount}</td>
                        <td className="py-2 text-chalk-dim">{Number(d.risk_pct_of_account).toFixed(2)}%</td>
                        <td className={`py-2 ${d.exceeds_daily_limit ? "text-loss" : "text-gain"}`}>
                          {d.exceeds_daily_limit ? "Over limit" : "OK"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            ) : (
              <EmptyState message="No daily risk data yet." />
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default RiskPage
