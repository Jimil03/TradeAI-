const metrics = [
  { label: "Win rate", value: "58.2%" },
  { label: "Profit factor", value: "1.74" },
  { label: "Expectancy", value: "+₹412" },
  { label: "Max drawdown", value: "-₹9,340" },
]

function AnalyticsPreview() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-signal">Analytics</p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-chalk">
            The same numbers, every time.
          </h2>
          <p className="mt-4 text-chalk-dim">
            Every metric runs through one tested calculation engine — not the
            AI. So the number you see today is the same number you'll see in
            a year, on any trade.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-lg border border-white/10 bg-paper p-6">
              <p className="font-mono text-xs uppercase tracking-wider text-chalk-dim">{m.label}</p>
              <p className="mt-2 font-mono text-2xl text-chalk">{m.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AnalyticsPreview