import { useState } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/Button'
import { buttonClassName } from '@/components/ui/buttonClassName'
import { StatusHint } from '@/components/ui/StatusHint'
import { TapToggle } from '@/components/ui/TapToggle'
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

const FINISH_SAFE_AREA = 'pb-[max(1rem,env(safe-area-inset-bottom))]'

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
        <TapToggle status={status} onToggle={onToggle} />
        <h1 className="pointer-events-none relative text-3xl font-bold text-balance">
          {task.name}
        </h1>
        <p className="pointer-events-none relative font-mono text-5xl tabular-nums">
          {formatChronoTime(elapsedMs)}
        </p>
        <StatusHint status={status} />
      </div>

      {/* Reserves the row's space even when hidden, so it doesn't shift the centered
          content above once Terminer appears */}
      {started ? (
        <Button size="lg" onClick={onFinish} className={FINISH_SAFE_AREA}>
          Terminer
        </Button>
      ) : (
        <div
          aria-hidden="true"
          className={`invisible ${buttonClassName({ size: 'lg' })} ${FINISH_SAFE_AREA}`}
        >
          Terminer
        </div>
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
            <Button size="lg" variant="secondary" onClick={onCancel}>
              Abandonner
            </Button>
            <Button size="lg" onClick={() => setConfirmingCancel(false)}>
              Continuer
            </Button>
          </div>
        </div>
      )}
    </main>
  )
}
