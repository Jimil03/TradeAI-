import { Link } from "react-router-dom"

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <span className="font-display text-xl font-semibold tracking-tight text-chalk">
          Trade<span className="text-signal">Mind</span>
        </span>
        <div className="hidden items-center gap-8 text-sm text-chalk-dim md:flex">
          <a href="#features" className="hover:text-chalk">Features</a>
          <a href="#pricing" className="hover:text-chalk">Pricing</a>
          <a href="#faq" className="hover:text-chalk">FAQ</a>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden text-sm text-chalk-dim hover:text-chalk sm:block">
            Log in
          </Link>
          <Link
            to="/register"
            className="rounded-md bg-signal px-4 py-2 text-sm font-medium text-ink transition hover:brightness-110"
          >
            Start analyzing
          </Link>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
