function AILimitationsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 text-chalk">
      <h1 className="font-display text-3xl font-semibold">AI Limitations Disclaimer</h1>
      <p className="mt-2 text-sm text-chalk-dim">Last updated: August 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-chalk-dim">
        <section>
          <h2 className="font-display text-lg font-semibold text-chalk">What the AI Coach Does</h2>
          <p className="mt-2">
            TradeMind's AI Coach explains statistics that have already been calculated by
            TradeMind's own deterministic backend systems (analytics, behavior, and risk
            engines). It translates those numbers into plain-language explanations.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-chalk">What the AI Coach Does Not Do</h2>
          <p className="mt-2">
            The AI Coach does not calculate your statistics itself, and its explanations
            never override figures produced by TradeMind's backend. If an AI-generated
            explanation and a displayed number ever appear inconsistent, the number shown
            elsewhere in the app is authoritative.
          </p>
          <p className="mt-2">
            The AI Coach does not guarantee profits, predict specific future prices, or
            claim certainty about your trading psychology. It is designed to use cautious,
            non-definitive language when describing behavioral patterns.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-chalk">Third-Party AI Provider</h2>
          <p className="mt-2">
            The AI Coach is powered by a third-party large language model (currently Google
            Gemini). Like all AI systems, it can occasionally produce imperfect, incomplete,
            or oddly phrased responses. It is provided as an educational aid, not a
            substitute for professional judgment.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-chalk">Usage Limits</h2>
          <p className="mt-2">
            AI Coach usage is subject to daily limits depending on your plan, to manage cost
            and ensure fair access for all users.
          </p>
        </section>
      </div>
    </div>
  )
}

export default AILimitationsPage