import type { ReactNode } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/Button'

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
        <Button size="lg" onClick={onGenerate}>
          Générer une liste
        </Button>
        <Button size="lg" variant="secondary" onClick={onChrono}>
          Chronométrer une tâche
        </Button>
      </div>
      {footerExtra}
    </main>
  )
}
