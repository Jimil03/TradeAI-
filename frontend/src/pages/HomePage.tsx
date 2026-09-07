import Navbar from "../components/marketing/Navbar"
import Hero from "../components/marketing/Hero"
import Problem from "../components/marketing/Problem"
import HowItWorks from "../components/marketing/HowItWorks"
import Features from "../components/marketing/Features"
import AnalyticsPreview from "../components/marketing/AnalyticsPreview"
import RiskBehavior from "../components/marketing/RiskBehavior"
import Pricing from "../components/marketing/Pricing"
import FAQ from "../components/marketing/FAQ"
import CTAFooter from "../components/marketing/CTAFooter"

function HomePage() {
  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <Hero />
      <Problem />
      <HowItWorks />
      <Features />
      <AnalyticsPreview />
      <RiskBehavior />
      <Pricing />
      <FAQ />
      <CTAFooter />
    </div>
  )
}

export default HomePage