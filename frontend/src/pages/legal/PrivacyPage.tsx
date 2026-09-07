function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 text-chalk">
      <h1 className="font-display text-3xl font-semibold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-chalk-dim">Last updated: August 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-chalk-dim">
        <section>
          <h2 className="font-display text-lg font-semibold text-chalk">1. What We Collect</h2>
          <p className="mt-2">
            We collect the information you provide directly: your email address, password
            (stored as a secure hash, never in plain text), and the trade data you enter or
            import (symbol, quantities, prices, timestamps, notes, and similar fields).
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-chalk">2. How We Use It</h2>
          <p className="mt-2">
            Your data is used to provide the Service to you: authenticating your account,
            calculating your analytics, behavior flags, and risk reports, and generating
            AI coach explanations. We do not sell your personal or trading data to third
            parties.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-chalk">3. AI Processing</h2>
          <p className="mt-2">
            When you use the AI Coach feature, a summary of your calculated statistics
            (such as win rate or risk flags) — never your raw trade-by-trade data — is sent
            to a third-party AI provider (Google Gemini) to generate a plain-language
            explanation. This processing is subject to that provider's own data handling
            practices.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-chalk">4. Data Storage and Security</h2>
          <p className="mt-2">
            Your data is stored in a PostgreSQL database. Passwords are hashed using
            Argon2, an industry-standard algorithm, and are never stored or transmitted in
            plain text. Every user's data is isolated — no user can access another user's
            trades, analytics, or account information.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-chalk">5. Data Retention</h2>
          <p className="mt-2">
            We retain your data for as long as your account is active. You may request
            deletion of your account and associated data at any time.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-chalk">6. Cookies and Local Storage</h2>
          <p className="mt-2">
            We use browser local storage to keep you signed in between visits. We do not
            use third-party advertising trackers.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-chalk">7. Your Rights</h2>
          <p className="mt-2">
            You may access, correct, export, or delete your data at any time through your
            account, or by contacting us directly.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-chalk">8. Changes to This Policy</h2>
          <p className="mt-2">
            We may update this Privacy Policy from time to time. Material changes will be
            communicated through the Service.
          </p>
        </section>
      </div>
    </div>
  )
}

export default PrivacyPage