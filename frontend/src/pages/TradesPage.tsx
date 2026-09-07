import { useState, useRef } from "react"
import { useAsync } from "../hooks/useAsync"
import { tradesService } from "../services/trades"
import { Button, Input, LoadingState, ErrorState, EmptyState, Card } from "../components/ui"
import { ApiError } from "../services/api"
import type { TradeCreate } from "../types/api"

const emptyForm: TradeCreate = {
  symbol: "",
  direction: "LONG",
  quantity: "",
  entry_price: "",
  entry_time: "",
  fees: "0",
  taxes: "0",
}

function TradesPage() {
  const trades = useAsync(() => tradesService.list(), [])
  const [form, setForm] = useState<TradeCreate>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleAddTrade(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    setSubmitting(true)
    try {
      await tradesService.create(form)
      setForm(emptyForm)
      trades.refetch()
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Could not add trade")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadStatus("Uploading...")
    try {
      const batch = await tradesService.uploadCsv(file)
      setUploadStatus(`Imported ${batch.imported_rows}, skipped ${batch.skipped_rows}.`)
      trades.refetch()
    } catch (err) {
      setUploadStatus(err instanceof ApiError ? err.message : "Upload failed")
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-chalk">Trades</h1>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            id="csv-upload"
          />
          <label htmlFor="csv-upload">
            <span className="cursor-pointer rounded-md border border-white/15 px-4 py-2 text-sm text-chalk hover:border-white/30">
              Upload CSV
            </span>
          </label>
        </div>
      </div>
      {uploadStatus && <p className="mt-2 text-sm text-chalk-dim">{uploadStatus}</p>}

      <Card className="mt-6">
        <h2 className="font-display text-lg font-semibold text-chalk">Add a trade</h2>
        <form onSubmit={handleAddTrade} className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Input
            placeholder="Symbol"
            required
            value={form.symbol}
            onChange={(e) => setForm({ ...form, symbol: e.target.value })}
          />
          <select
            value={form.direction}
            onChange={(e) => setForm({ ...form, direction: e.target.value as "LONG" | "SHORT" })}
            className="rounded-md border border-white/15 bg-paper-2 px-3 py-2 text-sm text-chalk focus:border-signal focus:outline-none"
          >
            <option value="LONG">LONG</option>
            <option value="SHORT">SHORT</option>
          </select>
          <Input
            placeholder="Quantity"
            type="number"
            required
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />
          <Input
            placeholder="Entry price"
            type="number"
            required
            value={form.entry_price}
            onChange={(e) => setForm({ ...form, entry_price: e.target.value })}
          />
          <Input
            placeholder="Exit price (optional)"
            type="number"
            value={form.exit_price ?? ""}
            onChange={(e) => setForm({ ...form, exit_price: e.target.value || null })}
          />
          <Input
            placeholder="Entry time"
            type="datetime-local"
            required
            value={form.entry_time}
            onChange={(e) => setForm({ ...form, entry_time: e.target.value })}
          />
          <Input
            placeholder="Stop loss (optional)"
            type="number"
            value={form.stop_loss ?? ""}
            onChange={(e) => setForm({ ...form, stop_loss: e.target.value || null })}
          />
          <Input
            placeholder="Strategy (optional)"
            value={form.strategy ?? ""}
            onChange={(e) => setForm({ ...form, strategy: e.target.value || null })}
          />
          <div className="col-span-2 md:col-span-4">
            {formError && <p className="mb-2 text-sm text-loss">{formError}</p>}
            <Button type="submit" disabled={submitting}>
              {submitting ? "Adding..." : "Add trade"}
            </Button>
          </div>
        </form>
      </Card>

      <div className="mt-8">
        {trades.loading ? (
          <LoadingState />
        ) : trades.error ? (
          <ErrorState message={trades.error} onRetry={trades.refetch} />
        ) : trades.data && trades.data.length > 0 ? (
          <Card>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-chalk-dim">
                  <th className="pb-2 font-normal">Symbol</th>
                  <th className="pb-2 font-normal">Direction</th>
                  <th className="pb-2 font-normal">Qty</th>
                  <th className="pb-2 font-normal">Entry</th>
                  <th className="pb-2 font-normal">Exit</th>
                  <th className="pb-2 font-normal">Strategy</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {trades.data.map((t) => (
                  <tr key={t.id} className="border-b border-white/5">
                    <td className="py-2 text-chalk">{t.symbol}</td>
                    <td className="py-2 text-chalk-dim">{t.direction}</td>
                    <td className="py-2 text-chalk-dim">{t.quantity}</td>
                    <td className="py-2 text-chalk-dim">{t.entry_price}</td>
                    <td className="py-2 text-chalk-dim">{t.exit_price ?? "open"}</td>
                    <td className="py-2 text-chalk-dim">{t.strategy ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        ) : (
          <EmptyState message="No trades yet. Add one above or upload a CSV." />
        )}
      </div>
    </div>
  )
}

export default TradesPage
