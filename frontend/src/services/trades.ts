import { api } from "./api"
import type { Trade, TradeCreate, ImportBatch } from "../types/api"

export const tradesService = {
  list: () => api.get<Trade[]>("/api/v1/trades"),
  create: (payload: TradeCreate) => api.post<Trade>("/api/v1/trades", payload),
  get: (id: string) => api.get<Trade>(`/api/v1/trades/${id}`),
  uploadCsv: (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    return api.postForm<ImportBatch>("/api/v1/imports", formData)
  },
  listImports: () => api.get<ImportBatch[]>("/api/v1/imports"),
}
