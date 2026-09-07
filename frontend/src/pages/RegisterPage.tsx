import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { authService } from "../services/auth"
import { useAuth } from "../hooks/useAuth"
import { Button, Input } from "../components/ui"
import { ApiError } from "../services/api"

function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await authService.register(email, password)
      await login(email, password)
      navigate("/dashboard")
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-center font-display text-2xl font-semibold text-chalk">
          Trade<span className="text-signal">Mind</span>
        </h1>
        <p className="mt-2 text-center text-sm text-chalk-dim">Create your account</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-xs text-chalk-dim">Email</label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-chalk-dim">Password</label>
            <Input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
            />
          </div>

          {error && <p className="text-sm text-loss">{error}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-chalk-dim">
          Already have an account?{" "}
          <Link to="/login" className="text-signal hover:brightness-110">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
