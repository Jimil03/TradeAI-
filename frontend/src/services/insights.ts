import { api } from "./api"
import type {
  AnalyticsSummary,
  BehaviorEvent,
  RiskReport,
  RiskSettings,
  PositionSizeResult,
  CoachResponse,
} from "../types/api"
import type { SignalResponse } from "../types/api"

export const analyticsService = {
  getSummary: () => api.get<AnalyticsSummary>("/api/v1/analytics/summary"),
}

export const behaviorService = {
  analyze: () => api.post<BehaviorEvent[]>("/api/v1/behavior/analyze"),
  listEvents: () => api.get<BehaviorEvent[]>("/api/v1/behavior/events"),
}

export const riskService = {
  getSettings: () => api.get<RiskSettings>("/api/v1/risk/settings"),
  updateSettings: (payload: Partial<RiskSettings>) =>
    api.put<RiskSettings>("/api/v1/risk/settings", payload),
  getReport: () => api.get<RiskReport>("/api/v1/risk/report"),
  positionSize: (entry_price: string | number, stop_loss: string | number, risk_pct?: string | number) =>
    api.post<PositionSizeResult>("/api/v1/risk/position-size", { entry_price, stop_loss, risk_pct }),
}

export const aiService = {
  askCoach: () => api.post<CoachResponse>("/api/v1/ai/coach"),
}
export const signalService = {
  getSignal: (symbol: string) => api.get<SignalResponse>(`/api/v1/signal/${symbol}`),
}
