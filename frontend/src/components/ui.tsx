import type { ReactNode } from "react"

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-white/10 bg-paper p-6 ${className}`}>
      {children}
    </div>
  )
}

export function StatCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string
  value: string
  tone?: "neutral" | "gain" | "loss"
}) {
  const toneClass =
    tone === "gain" ? "text-gain" : tone === "loss" ? "text-loss" : "text-chalk"
  return (
    <div className="rounded-lg border border-white/10 bg-paper p-6">
      <p className="font-mono text-xs uppercase tracking-wider text-chalk-dim">{label}</p>
      <p className={`mt-2 font-mono text-2xl ${toneClass}`}>{value}</p>
    </div>
  )
}

export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return <p className="py-8 text-center text-sm text-chalk-dim">{label}</p>
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-lg border border-loss/30 bg-loss/10 p-6 text-center">
      <p className="text-sm text-loss">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 rounded-md border border-white/15 px-4 py-1.5 text-sm text-chalk hover:border-white/30"
        >
          Retry
        </button>
      )}
    </div>
  )
}

export function EmptyState({ message }: { message: string }) {
  return <p className="py-8 text-center text-sm text-chalk-dim">{message}</p>
}

export function Button({
  children,
  onClick,
  variant = "primary",
  disabled,
  type = "button",
}: {
  children: ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary"
  disabled?: boolean
  type?: "button" | "submit"
}) {
  const base = "rounded-md px-4 py-2 text-sm font-medium transition disabled:opacity-50"
  const styles =
    variant === "primary"
      ? "bg-signal text-ink hover:brightness-110"
      : "border border-white/15 text-chalk hover:border-white/30"
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles}`}>
      {children}
    </button>
  )
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-md border border-white/15 bg-paper-2 px-3 py-2 text-sm text-chalk placeholder:text-chalk-dim focus:border-signal focus:outline-none ${props.className ?? ""}`}
    />
  )
}
