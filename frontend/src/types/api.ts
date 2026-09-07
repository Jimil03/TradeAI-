export interface User {
  id: string
  email: string
  is_active: boolean
  created_at: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface Trade {
  id: string
  user_id: string
  symbol: string
  exchange: string | null
  asset_type: string
  direction: "LONG" | "SHORT"
  quantity: string
  entry_price: string
  exit_price: string | null
  entry_time: string
  exit_time: string | null
  stop_loss: string | null
  target: string | null
  fees: string
  taxes: string
  notes: string | null
  strategy: string | null
  source: string
  created_at: string
  updated_at: string
}

export interface TradeCreate {
  symbol: string
  exchange?: string | null
  asset_type?: string
  direction: "LONG" | "SHORT"
  quantity: string | number
  entry_price: string | number
  exit_price?: string | number | null
  entry_time: string
  exit_time?: string | null
  stop_loss?: string | number | null
  target?: string | number | null
  fees?: string | number
  taxes?: string | number
  notes?: string | null
  strategy?: string | null
  source?: string
}

export interface AnalyticsSummary {
  total_trades: number
  closed_trades: number
  win_rate: string | null
  net_pnl: string
  gross_profit: string
  gross_loss: string
  average_win: string | null
  average_loss: string | null
  profit_factor: string | null
  expectancy: string | null
  max_drawdown: string
  average_risk_reward: string | null
  longest_win_streak: number
  longest_loss_streak: number
}

export interface BehaviorEvent {
  id: string
  trade_id: string | null
  event_type: string
  severity: string
  confidence: number
  trigger_data: string | null
  explanation: string
  created_at: string
}

export interface RiskSettings {
  account_balance: string
  max_risk_per_trade_pct: string
  max_daily_risk_pct: string
}

export interface RiskReport {
  account_balance: string
  max_risk_per_trade_pct: string
  max_daily_risk_pct: string
  trades_exceeding_per_trade_limit: Array<{
    trade_id: string
    symbol: string
    risk_pct_of_account: string
    max_allowed_pct: string
  }>
  daily_risk: Array<{
    date: string
    trade_count: number
    total_risk_amount: string
    risk_pct_of_account: string
    exceeds_daily_limit: boolean
  }>
  exposure: {
    open_trade_count: number
    total_notional_exposure: string
    exposure_by_symbol: Record<string, string>
  }
}

export interface PositionSizeResult {
  suggested_quantity: string
  risk_amount: string
  risk_pct_used: string
}

export interface ImportBatch {
  id: string
  filename: string
  status: string
  total_rows: number
  imported_rows: number
  skipped_rows: number
  error_summary: string | null
  created_at: string
}

export interface CoachResponse {
  message: string
  tokens_used: number
}
export interface SignalResponse {
  symbol: string
  data_available: boolean
  direction_probability_up: number | null
  direction_probability_down: number | null
  confidence_level: string
  key_factors: string[]
  volatility_atr: number | null
  disclaimer: string
  message: string | null
}
