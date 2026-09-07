const plans = [
  {
    name: "Free",
    price: "₹0",
    features: ["Trading journal", "Basic analytics", "Limited AI analyses"],
  },
  {
    name: "Pro",
    price: "₹—",
    features: ["Advanced analytics", "Behavior detection", "Risk tools", "More AI analyses"],
    highlighted: true,
  },
  {
    name: "Premium",
    price: "₹—",
    features: ["Advanced AI reports", "Personalized insights", "Highest usage limits"],
  },
]

function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-center font-display text-3xl font-semibold text-chalk">
        Pricing
      </h2>
      <p className="mt-3 text-center text-sm text-chalk-dim">
        Final pricing is being validated — plans and limits shown are placeholders.
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`rounded-lg border p-8 ${
              p.highlighted ? "border-signal bg-paper-2" : "border-white/10 bg-paper"
            }`}
          >
            <h3 className="font-display text-xl font-semibold text-chalk">{p.name}</h3>
            <p className="mt-2 font-mono text-2xl text-chalk">{p.price}</p>
            <ul className="mt-6 space-y-2 text-sm text-chalk-dim">
              {p.features.map((f) => (
                <li key={f}>— {f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Pricing