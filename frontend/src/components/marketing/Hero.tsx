import { Link } from "react-router-dom"

const sampleTrades = [
  { symbol: "NIFTY 24800 CE", direction: "LONG", pnl: "+4,320" },
  { symbol: "RELIANCE", direction: "SHORT", pnl: "-1,180" },
  { symbol: "BTCUSD", direction: "LONG", pnl: "+11,940" },
  { symbol: "HDFCBANK", direction: "LONG", pnl: "-620" },
  { symbol: "TCS", direction: "SHORT", pnl: "+2,750" },
]

function LedgerRow({ symbol, direction, pnl }: { symbol: string; direction: string; pnl: string }) {
  const isGain = pnl.startsWith("+")
  return (
    <div className="flex items-center justify-between border-b border-white/5 px-4 py-3 font-mono text-sm">
      <span className="text-chalk-dim">{symbol}</span>
      <span className="text-chalk-dim">{direction}</span>
      <span className={isGain ? "text-gain" : "text-loss"}>{pnl}</span>
    </div>
  )
}

function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
      <div className="flex flex-col justify-center">
        <h1 className="font-display text-4xl font-semibold leading-tight text-chalk md:text-5xl">
          Every trade tells a story.
          <br />
          Most journals just store the numbers.
        </h1>
        <p className="mt-6 max-w-md text-base text-chalk-dim">
          TradeMind AI turns your raw trade history into a clear record of what
          you actually did — the patterns, the risk you took, and where
          discipline slipped.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            to="/register"
            className="rounded-md bg-signal px-6 py-3 text-sm font-medium text-ink transition hover:brightness-110"
          >
            Start analyzing your trading
          </Link>
          <a
            href="#features"
            className="rounded-md border border-white/15 px-6 py-3 text-sm font-medium text-chalk transition hover:border-white/30"
          >
            See how it works
          </a>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-white/10 bg-paper shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <span className="font-mono text-xs uppercase tracking-wider text-chalk-dim">
            Recent trades
          </span>
          <span className="font-mono text-xs text-gain">+17,210 today</span>
        </div>
        {sampleTrades.map((t) => (
          <LedgerRow key={t.symbol} {...t} />
        ))}
      </div>
    </section>
  )
}

export default Hero
