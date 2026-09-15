import { useState } from 'react'
import {
  sessionSummary,
  taskDurations,
  timelineSegments,
  type TimelineSegment,
} from '@/domain/debriefing'
import type { TimelineEntry } from '@/domain/session'
import type { Difficulty, Task } from '@/domain/task'
import { TaskDebriefSheet } from './TaskDebriefSheet'

const MINUTE_MS = 60_000
const PX_PER_MINUTE = 16
// Short segments stay readable (work) and visible (pauses) despite the scale
const MIN_WORK_PX = 44
const MIN_PAUSE_PX = 12

const plural = (count: number, singular: string, pluralForm: string) =>
  count >= 2 ? pluralForm : singular

const clockTime = (ms: number) =>
  new Date(ms).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

function TimelineBlock({
  segment,
  origin,
  task,
  onSelect,
}: {
  segment: TimelineSegment
  origin: number
  task?: Task
  onSelect: () => void
}) {
  const minutes = (segment.to - segment.from) / MINUTE_MS

  if (segment.kind !== 'work') {
    return (
      <li
        style={{ height: Math.max(minutes * PX_PER_MINUTE, MIN_PAUSE_PX) }}
        className="ml-14 flex items-center rounded-md bg-[repeating-linear-gradient(45deg,var(--color-slate-700)_0_6px,transparent_6px_12px)] px-3 text-xs text-slate-400"
      >
        <span className="sr-only">{segment.kind === 'pause' ? 'Pause' : 'Attente'}</span>
      </li>
    )
  }

  return (
    <li className="flex gap-2">
      <span className="w-12 shrink-0 pt-1 text-right text-xs text-slate-500 tabular-nums">
        {clockTime(origin + segment.from)}
      </span>
      <button
        type="button"
        onClick={onSelect}
        style={{ height: Math.max(minutes * PX_PER_MINUTE, MIN_WORK_PX) }}
        className="flex flex-1 items-start rounded-md border-l-4 border-emerald-400 bg-emerald-950 px-3 py-2 text-left font-medium active:bg-emerald-900"
      >
        {task?.name}
      </button>
    </li>
  )
}

/** End of session: agenda-like timeline, per-task details and summary */
export function DebriefingScreen({
  tasks,
  timeline,
  onUpdateTask,
  onClose,
}: {
  tasks: Task[]
  timeline: TimelineEntry[]
  onUpdateTask: (task: Task) => void
  onClose: () => void
}) {
  const [selected, setSelected] = useState<number | null>(null)
  // Felt difficulty is only kept for the screen's lifetime until a session history exists
  const [actualDifficulties, setActualDifficulties] = useState<
    Record<number, Difficulty | undefined>
  >({})

  const segments = timelineSegments(timeline)
  const origin = timeline[0]?.at ?? 0
  const { completedCount, taskCount, elapsedMs } = sessionSummary(timeline, tasks.length)
  const elapsedMinutes = Math.round(elapsedMs / MINUTE_MS)
  const selectedTask = selected === null ? undefined : tasks[selected]

  return (
    <main className="flex min-h-dvh flex-col bg-slate-900 px-6 pt-[max(2rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))] text-slate-50">
      <h1 className="text-3xl font-bold">Bravo !</h1>
      <p className="mt-2 mb-6 text-slate-300">
        La session est terminée. Chaque tâche lancée est une victoire.
      </p>

      {segments.length === 0 ? (
        <p className="text-slate-400">Aucune tâche démarrée.</p>
      ) : (
        <ol aria-label="Timeline" className="flex flex-col gap-1">
          {segments.map((segment) => (
            <TimelineBlock
              key={segment.from}
              segment={segment}
              origin={origin}
              task={tasks[segment.taskIndex]}
              onSelect={() => setSelected(segment.taskIndex)}
            />
          ))}
        </ol>
      )}

      <footer className="mt-auto flex flex-col gap-4 pt-8 text-center">
        <p className="text-slate-300">
          {completedCount} {plural(completedCount, 'tâche effectuée', 'tâches effectuées')} sur{' '}
          {taskCount}, temps passé : {elapsedMinutes} {plural(elapsedMinutes, 'minute', 'minutes')}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="rounded-2xl bg-emerald-500 px-6 py-4 text-xl font-semibold text-slate-950 active:bg-emerald-400"
        >
          Fermer
        </button>
      </footer>

      {selected !== null && selectedTask && (
        <TaskDebriefSheet
          task={selectedTask}
          {...taskDurations(timeline, selected)}
          actualDifficulty={actualDifficulties[selected]}
          onActualDifficultyChange={(value) =>
            setActualDifficulties((current) => ({ ...current, [selected]: value }))
          }
          onUpdateTask={onUpdateTask}
          onClose={() => setSelected(null)}
        />
      )}
    </main>
  )
}
