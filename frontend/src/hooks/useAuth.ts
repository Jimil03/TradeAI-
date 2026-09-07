import { useState, useCallback } from "react"
import { authService } from "../services/auth"

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated())

  const login = useCallback(async (email: string, password: string) => {
    await authService.login(email, password)
    setIsAuthenticated(true)
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setIsAuthenticated(false)
  }, [])

  return { isAuthenticated, login, logout }
}
