import { Navigate } from "react-router-dom"
import type { ReactNode } from "react"
import { authService } from "../services/auth"

function ProtectedRoute({ children }: { children: ReactNode }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

export default ProtectedRoute
