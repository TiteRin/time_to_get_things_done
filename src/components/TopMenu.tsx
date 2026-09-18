import type { ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
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
      <Button size="lg" onClick={onFinish}>
        Terminer
      </Button>
      <Button size="lg" variant="secondary" onClick={onCancel}>
        Annuler
      </Button>
      {children && <div className="mt-2 text-center">{children}</div>}
    </div>
  )
}
