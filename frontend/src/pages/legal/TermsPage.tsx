function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 text-chalk">
      <h1 className="font-display text-3xl font-semibold">Terms of Service</h1>
      <p className="mt-2 text-sm text-chalk-dim">Last updated: August 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-chalk-dim">
        <section>
          <h2 className="font-display text-lg font-semibold text-chalk">1. Acceptance of Terms</h2>
          <p className="mt-2">
            By creating an account or using TradeMind ("the Service"), you agree to these
            Terms of Service. If you do not agree, do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-chalk">2. What TradeMind Is</h2>
          <p className="mt-2">
            TradeMind is an analytical and educational trading journal. It helps you record,
            analyze, and reflect on your own trading activity. TradeMind is not a broker,
            investment adviser, or financial institution, and does not execute trades,
            hold funds, or manage assets on your behalf.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-chalk">3. No Financial Advice</h2>
          <p className="mt-2">
            Nothing in the Service — including analytics, behavior flags, risk calculations,
            AI-generated explanations, or stock insight signals — constitutes financial,
            investment, tax, or legal advice. All content is provided for educational
            purposes only. You are solely responsible for your own trading and investment
            decisions.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-chalk">4. Your Account</h2>
          <p className="mt-2">
            You are responsible for maintaining the confidentiality of your account
            credentials and for all activity under your account. You must provide accurate
            information when registering and promptly update it if it changes.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-chalk">5. Your Data</h2>
          <p className="mt-2">
            You retain ownership of the trade data you upload or enter. You grant TradeMind
            a limited license to process that data solely to provide the Service to you
            (e.g. calculating analytics, generating AI explanations). See our{" "}
            <a href="/privacy" className="text-signal hover:brightness-110">Privacy Policy</a>{" "}
            for details on how your data is handled.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-chalk">6. Acceptable Use</h2>
          <p className="mt-2">
            You agree not to misuse the Service — including attempting to access another
            user's data, interfering with the Service's operation, or using it for any
            unlawful purpose.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-chalk">7. Disclaimers and Limitation of Liability</h2>
          <p className="mt-2">
            The Service is provided "as is" without warranties of any kind. TradeMind does
            not guarantee the accuracy, completeness, or reliability of any analytics,
            behavioral flags, risk calculations, or AI-generated content. To the maximum
            extent permitted by law, TradeMind and its operators are not liable for any
            trading losses, financial decisions, or damages arising from use of the
            Service.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-chalk">8. Changes to These Terms</h2>
          <p className="mt-2">
            We may update these Terms from time to time. Continued use of the Service after
            changes take effect constitutes acceptance of the revised Terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-chalk">9. Contact</h2>
          <p className="mt-2">
            Questions about these Terms can be directed to the contact information provided
            on our website.
          </p>
        </section>
      </div>
    </div>
  )
}

export default TermsPage