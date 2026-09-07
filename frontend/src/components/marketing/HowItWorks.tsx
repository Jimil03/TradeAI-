const steps = [
  {
    n: "01",
    title: "Import",
    body: "Upload a CSV from your broker. TradeMind validates it, maps the columns, and flags anything it can't parse before importing a single row.",
  },
  {
    n: "02",
    title: "Detect",
    body: "A deterministic analytics and behavior engine calculates your real metrics and flags patterns like revenge trading or oversized risk — never guesses.",
  },
  {
    n: "03",
    title: "Correct",
    body: "Your AI coach explains what the backend already calculated, in plain language, and helps you build a plan for the pattern it found.",
  },
]

function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-center font-display text-3xl font-semibold text-chalk">
        How it works
      </h2>
      <div className="mt-14 grid gap-10 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n}>
            <span className="font-mono text-sm text-signal">{s.n}</span>
            <h3 className="mt-3 font-display text-xl font-semibold text-chalk">
              {s.title}
            </h3>
            <p className="mt-3 text-sm text-chalk-dim">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default HowItWorks