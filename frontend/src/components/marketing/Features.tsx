const features = [
  { title: "Trade journal", body: "Every trade, tagged by strategy, symbol, and setup — searchable and exportable." },
  { title: "Analytics engine", body: "Win rate, expectancy, profit factor, drawdown — calculated once, deterministically, everywhere." },
  { title: "Behavior detection", body: "Flags patterns like revenge trading or overtrading, phrased as possibilities, never certainties." },
  { title: "Risk tools", body: "Position sizing, daily risk limits, and exposure tracking, enforced consistently across your account." },
  { title: "AI coach", body: "Explains your real numbers in plain language. It never overrides what the backend already calculated." },
  { title: "Broker CSV import", body: "Safe, validated imports with a preview step and full import history." },
]

function Features() {
  return (
    <section id="features" className="border-y border-white/10 bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-3xl font-semibold text-chalk">
          What's inside
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-lg border border-white/10 bg-paper-2 p-6">
              <h3 className="font-display text-lg font-semibold text-chalk">{f.title}</h3>
              <p className="mt-2 text-sm text-chalk-dim">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features