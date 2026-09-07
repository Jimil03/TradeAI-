function RiskBehavior() {
  return (
    <section className="border-y border-white/10 bg-paper">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-signal">
          Behavior &amp; risk
        </p>
        <h2 className="mt-4 font-display text-3xl font-semibold text-chalk">
          Possible patterns, never verdicts.
        </h2>
        <p className="mt-6 text-chalk-dim">
          TradeMind AI never tells you what you were feeling. It flags what
          the data shows — "possible revenge-trading pattern detected" — and
          leaves the interpretation to you. Risk limits, drawdown monitoring,
          and exposure tracking run the same way: deterministic, on the
          backend, always visible.
        </p>
      </div>
    </section>
  )
}

export default RiskBehavior