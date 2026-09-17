import { formatElapsedTime } from '@/domain/duration'
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
  return (
    <main className="grid h-dvh w-full grid-rows-[auto_1fr_auto] bg-slate-900 p-6 text-slate-50">
      <button
        type="button"
        onClick={onCancel}
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
          {formatElapsedTime(elapsedMs)}
        </p>
        <p className="pointer-events-none relative flex items-center gap-2 text-slate-400">
          {status === 'running' && (
            <span aria-hidden="true" className="size-2 animate-pulse rounded-full bg-emerald-400" />
          )}
          {STATUS_HINT[status]}
        </p>
      </div>

      <button
        type="button"
        onClick={onFinish}
        className="rounded-2xl bg-emerald-500 py-4 text-lg font-semibold text-slate-950 pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        Terminer
      </button>
    </main>
  )
}
