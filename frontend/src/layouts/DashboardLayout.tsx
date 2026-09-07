import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const navItems = [
  { to: "/dashboard", label: "Overview", end: true },
  { to: "/dashboard/trades", label: "Trades" },
  { to: "/dashboard/analytics", label: "Analytics" },
  { to: "/dashboard/behavior", label: "Behavior" },
  { to: "/dashboard/risk", label: "Risk" },
  { to: "/dashboard/coach", label: "AI Coach" },
  { to: "/dashboard/signal", label: "Stock Insight" },
]

function DashboardLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate("/login")
  }

  return (
    <div className="flex min-h-screen bg-ink">
      <aside className="w-56 shrink-0 border-r border-white/10 px-4 py-6">
        <div className="mb-8 px-2 font-display text-lg font-semibold text-chalk">
          Trade<span className="text-signal">Mind</span>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-paper-2 text-chalk"
                    : "text-chalk-dim hover:bg-paper-2 hover:text-chalk"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-8 w-full rounded-md px-3 py-2 text-left text-sm text-chalk-dim hover:bg-paper-2 hover:text-chalk"
        >
          Log out
        </button>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout
