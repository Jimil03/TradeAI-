import { Link } from "react-router-dom"

function CTAFooter() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="font-display text-3xl font-semibold text-chalk">
          Start analyzing your trading.
        </h2>
        <Link
          to="/register"
          className="mt-8 inline-block rounded-md bg-signal px-8 py-3 text-sm font-medium text-ink transition hover:brightness-110"
        >
          Create free account
        </Link>
      </section>
      <footer className="border-t border-white/10 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-chalk-dim md:flex-row">
          <span className="font-display text-chalk">TradeMind</span>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-chalk">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-chalk">Terms</Link>
            <Link to="/risk-disclosure" className="hover:text-chalk">Risk Disclosure</Link>
            <Link to="/ai-limitations" className="hover:text-chalk">AI Limitations</Link>
          </div>
        </div>
      </footer>
    </>
  )
}

export default CTAFooter
