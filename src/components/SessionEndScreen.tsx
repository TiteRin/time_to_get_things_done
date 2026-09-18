import type { ReactNode } from 'react'
import { ScreenHeader } from '@/components/ui/ScreenHeader'
import { formatElapsedTime } from '@/domain/duration'
import type { TimelineEntry } from '@/domain/session'
import type { Task } from '@/domain/task'

const ENTRY_LABEL: Record<TimelineEntry['type'], string> = {
  start: 'Démarrer',
  pause: 'Pause',
  resume: 'Reprise',
  complete: 'Tâche faite',
  finish: 'Session terminée',
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
      <ScreenHeader title="Session terminée" size="lg" className="mb-6" />

      {timeline.length === 0 ? (
        <p className="text-muted-foreground">Aucune action enregistrée.</p>
      ) : (
        <ol aria-label="Timeline" className="flex flex-col gap-3">
          {timeline.map((entry, i) => (
            <li key={i} className="flex gap-4">
              <span className="text-muted-foreground tabular-nums">
                {formatElapsedTime(entry.at - origin)}
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
