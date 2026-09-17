import type { ReactNode } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'
import type { TimelineEntry } from '@/domain/session'
import type { Task } from '@/domain/task'

const ENTRY_LABEL: Record<TimelineEntry['type'], string> = {
  start: 'Démarrer',
  pause: 'Pause',
  resume: 'Reprise',
  complete: 'Tâche faite',
  finish: 'Session terminée',
}

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

/** Placeholder until the Débriefing screen exists: dumps the raw timeline */
export function SessionEndScreen({
  tasks,
  timeline,
  footer,
}: {
  tasks: Task[]
  timeline: TimelineEntry[]
  footer?: ReactNode
}) {
  const origin = timeline[0]?.at ?? 0

  return (
    <main className="min-h-dvh bg-background px-6 pt-[max(2rem,env(safe-area-inset-top))] pb-8 text-foreground">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Session terminée</h1>
        <ThemeToggle />
      </div>

      {timeline.length === 0 ? (
        <p className="text-muted-foreground">Aucune action enregistrée.</p>
      ) : (
        <ol aria-label="Timeline" className="flex flex-col gap-3">
          {timeline.map((entry, i) => (
            <li key={i} className="flex gap-4">
              <span className="text-muted-foreground tabular-nums">
                {formatElapsed(entry.at - origin)}
              </span>
              <span>
                {ENTRY_LABEL[entry.type]} · {tasks[entry.taskIndex]?.name}
              </span>
            </li>
          ))}
        </ol>
      )}

      {footer && <div className="mt-8 text-center">{footer}</div>}
    </main>
  )
}
