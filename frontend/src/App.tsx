import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import TermsPage from "./pages/legal/TermsPage"
import PrivacyPage from "./pages/legal/PrivacyPage"
import RiskDisclosurePage from "./pages/legal/RiskDisclosurePage"
import AILimitationsPage from "./pages/legal/AILimitationsPage"
import DashboardLayout from "./layouts/DashboardLayout"
import DashboardPage from "./pages/DashboardPage"
import TradesPage from "./pages/TradesPage"
import AnalyticsPage from "./pages/AnalyticsPage"
import BehaviorPage from "./pages/BehaviorPage"
import RiskPage from "./pages/RiskPage"
import CoachPage from "./pages/CoachPage"
import ProtectedRoute from "./components/ProtectedRoute"
import SignalPage from "./pages/SignalPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/risk-disclosure" element={<RiskDisclosurePage />} />
      <Route path="/ai-limitations" element={<AILimitationsPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="trades" element={<TradesPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="behavior" element={<BehaviorPage />} />
        <Route path="risk" element={<RiskPage />} />
        <Route path="coach" element={<CoachPage />} />
        <Route path="signal" element={<SignalPage />} />
      </Route>
    </Routes>
  )
}

export default App
