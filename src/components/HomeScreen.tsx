import type { ReactNode } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'

export function HomeScreen({
  onGenerate,
  onChrono,
  footerExtra,
}: {
  onGenerate: () => void
  onChrono: () => void
  /** Extra navigation rendered under the two actions (e.g. a Configuration link) */
  footerExtra?: ReactNode
}) {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center gap-10 bg-background p-6 text-center">
      <ThemeToggle className="absolute top-[max(1rem,env(safe-area-inset-top))] right-4" />
      <h1 className="text-2xl font-bold text-foreground">Time To Get Things Done</h1>
      <div className="flex w-full max-w-sm flex-col gap-4">
        <button
          type="button"
          onClick={onGenerate}
          className="rounded-xl bg-accent py-4 text-lg font-medium text-accent-foreground"
        >
          Générer une liste
        </button>
        <button
          type="button"
          onClick={onChrono}
          className="rounded-xl border border-border py-4 text-lg font-medium text-foreground"
        >
          Chronométrer une tâche
        </button>
      </div>
      {footerExtra}
    </main>
  )
}
