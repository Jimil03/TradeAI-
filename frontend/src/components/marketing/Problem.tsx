function Problem() {
  return (
    <section className="border-y border-white/10 bg-paper">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-signal">
          The problem
        </p>
        <h2 className="mt-4 font-display text-3xl font-semibold text-chalk md:text-4xl">
          A spreadsheet can tell you what happened.
          <br />
          It can't tell you why it keeps happening.
        </h2>
        <p className="mt-6 text-chalk-dim">
          Most traders can already see their win rate. What's missing is the
          pattern underneath it — the oversized position after a loss, the
          entry taken without a plan, the stop that got moved. TradeMind AI
          is built to surface that, not just tally P&amp;L.
        </p>
      </div>
    </section>
  )
}

export default Problem