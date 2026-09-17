import { useState } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { formatChronoTime } from '@/domain/duration'
import type { SessionStatus } from '@/domain/session'
import type { Task } from '@/domain/task'

export type ChronoScreenProps = {
  task: Task
  status: Exclude<SessionStatus, 'ended'>
  /** Time spent on the task so far, excluding pauses; ticks live while running */
  elapsedMs: number
  onToggle: () => void
  onFinish: () => void
  onCancel: () => void
}

const CENTER_LABEL = { idle: 'Démarrer', running: 'Pause', paused: 'Reprendre' } as const
const STATUS_HINT = {
  idle: 'Touchez pour commencer',
  running: 'En cours',
  paused: 'En pause',
} as const

/** Unlike the Exécution screen, the chrono is a deliberate, visible timer */
export function ChronoScreen({
  task,
  status,
  elapsedMs,
  onToggle,
  onFinish,
  onCancel,
}: ChronoScreenProps) {
  const [confirmingCancel, setConfirmingCancel] = useState(false)
  const started = status !== 'idle'

  const handleCancelPress = () => {
    if (started) {
      setConfirmingCancel(true)
      return
    }
    onCancel()
  }

  return (
    <main className="grid h-dvh w-full grid-rows-[auto_1fr_auto] bg-background p-6 text-foreground">
      <div className="flex items-center justify-between pt-[max(0.5rem,env(safe-area-inset-top))]">
        <button
          type="button"
          onClick={handleCancelPress}
          className="font-medium text-muted-foreground"
        >
          Annuler
        </button>
        <ThemeToggle />
      </div>

      <div className="relative flex flex-col items-center justify-center gap-6 px-6 text-center">
        <button
          type="button"
          aria-label={CENTER_LABEL[status]}
          onClick={onToggle}
          className="absolute inset-0 active:bg-surface/30"
        />
        <h1 className="pointer-events-none relative text-3xl font-bold text-balance">
          {task.name}
        </h1>
        <p className="pointer-events-none relative font-mono text-5xl tabular-nums">
          {formatChronoTime(elapsedMs)}
        </p>
        <p className="pointer-events-none relative flex items-center gap-2 text-muted-foreground">
          {status === 'running' && (
            <span
              aria-hidden="true"
              className="size-2 animate-pulse rounded-full bg-accent-secondary"
            />
          )}
          {STATUS_HINT[status]}
        </p>
      </div>

      {started && (
        <button
          type="button"
          onClick={onFinish}
          className="rounded-2xl bg-accent py-4 text-lg font-semibold text-accent-foreground pb-[max(1rem,env(safe-area-inset-bottom))]"
        >
          Terminer
        </button>
      )}

      {confirmingCancel && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Confirmer l'abandon"
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/90 p-6 text-center backdrop-blur-sm"
        >
          <p className="text-lg font-medium">Abandonner ce chronométrage ?</p>
          <div className="flex w-full flex-col gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-2xl border border-border px-6 py-4 text-lg font-semibold text-foreground active:bg-surface"
            >
              Abandonner
            </button>
            <button
              type="button"
              onClick={() => setConfirmingCancel(false)}
              className="rounded-2xl bg-accent px-6 py-4 text-lg font-semibold text-accent-foreground active:bg-accent/85"
            >
              Continuer
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
