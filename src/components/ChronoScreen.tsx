import { useState } from 'react'
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
    <main className="grid h-dvh w-full grid-rows-[auto_1fr_auto] bg-slate-900 p-6 text-slate-50">
      <button
        type="button"
        onClick={handleCancelPress}
        className="justify-self-start pt-[max(0.5rem,env(safe-area-inset-top))] font-medium text-slate-400"
      >
        Annuler
      </button>

      <div className="relative flex flex-col items-center justify-center gap-6 px-6 text-center">
        <button
          type="button"
          aria-label={CENTER_LABEL[status]}
          onClick={onToggle}
          className="absolute inset-0 active:bg-slate-800/30"
        />
        <h1 className="pointer-events-none relative text-3xl font-bold text-balance">
          {task.name}
        </h1>
        <p className="pointer-events-none relative font-mono text-5xl tabular-nums">
          {formatChronoTime(elapsedMs)}
        </p>
        <p className="pointer-events-none relative flex items-center gap-2 text-slate-400">
          {status === 'running' && (
            <span aria-hidden="true" className="size-2 animate-pulse rounded-full bg-emerald-400" />
          )}
          {STATUS_HINT[status]}
        </p>
      </div>

      {started && (
        <button
          type="button"
          onClick={onFinish}
          className="rounded-2xl bg-emerald-500 py-4 text-lg font-semibold text-slate-950 pb-[max(1rem,env(safe-area-inset-bottom))]"
        >
          Terminer
        </button>
      )}

      {confirmingCancel && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Confirmer l'abandon"
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-950/90 p-6 text-center backdrop-blur-sm"
        >
          <p className="text-lg font-medium">Abandonner ce chronométrage ?</p>
          <div className="flex w-full flex-col gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-2xl border border-slate-600 px-6 py-4 text-lg font-semibold text-slate-100 active:bg-slate-800"
            >
              Abandonner
            </button>
            <button
              type="button"
              onClick={() => setConfirmingCancel(false)}
              className="rounded-2xl bg-emerald-500 px-6 py-4 text-lg font-semibold text-slate-950 active:bg-emerald-400"
            >
              Continuer
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
