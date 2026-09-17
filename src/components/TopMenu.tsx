import type { ReactNode } from 'react'
import { ThemeToggle } from './ThemeToggle'

export function TopMenu({
  onCancel,
  onFinish,
  children,
}: {
  onCancel: () => void
  onFinish: () => void
  children?: ReactNode
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menu de la session"
      className="absolute inset-0 flex flex-col justify-start gap-4 bg-background/90 p-6 pt-[max(1.5rem,env(safe-area-inset-top))] backdrop-blur-sm"
    >
      <ThemeToggle className="absolute top-[max(1rem,env(safe-area-inset-top))] right-4" />
      <button
        type="button"
        onClick={onFinish}
        className="rounded-2xl bg-accent px-6 py-5 text-xl font-semibold text-accent-foreground active:bg-accent/85"
      >
        Terminer
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="rounded-2xl border border-border px-6 py-5 text-xl font-semibold text-foreground active:bg-surface"
      >
        Annuler
      </button>
      {children && <div className="mt-2 text-center">{children}</div>}
    </div>
  )
}
