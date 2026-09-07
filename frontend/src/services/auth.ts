import { api, tokenStorage } from "./api"
import type { TokenResponse, User } from "../types/api"

export const authService = {
  async login(email: string, password: string): Promise<void> {
    const res = await api.post<TokenResponse>("/api/v1/auth/login", { email, password })
    tokenStorage.set(res.access_token)
  },

  async register(email: string, password: string): Promise<User> {
    return api.post<User>("/api/v1/auth/register", { email, password })
  },

  logout(): void {
    tokenStorage.clear()
  },

  isAuthenticated(): boolean {
    return !!tokenStorage.get()
  },
}
