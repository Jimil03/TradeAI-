const faqs = [
  { q: "Does TradeMind AI guarantee profits?", a: "No. It's an analytical and educational tool. It does not predict prices or guarantee outcomes." },
  { q: "Is my data shared with other users?", a: "No. Every user's trades, analytics, and AI conversations are fully isolated." },
  { q: "Which brokers can I import from?", a: "CSV import works with standard broker exports; broader broker integrations are planned." },
]

function FAQ() {
  return (
    <section id="faq" className="border-y border-white/10 bg-paper">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-center font-display text-3xl font-semibold text-chalk">
          FAQ
        </h2>
        <div className="mt-10 space-y-6">
          {faqs.map((f) => (
            <div key={f.q} className="border-b border-white/10 pb-6">
              <p className="font-medium text-chalk">{f.q}</p>
              <p className="mt-2 text-sm text-chalk-dim">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ