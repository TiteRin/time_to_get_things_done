import { useState } from 'react'
import {
  formatOffset,
  sessionSummary,
  taskDurations,
  timelineBlocks,
  type TimelineBlock,
} from '@/domain/debriefing'
import type { TimelineEntry } from '@/domain/session'
import type { Difficulty, Task } from '@/domain/task'
import { TaskDebriefSheet } from './TaskDebriefSheet'

const MINUTE_MS = 60_000
const PX_PER_MINUTE = 16
const GAP_PX = 4
// Short blocks stay readable (tasks) and visible (waits) despite the scale
const MIN_TASK_PX = 44
const MIN_WAIT_PX = 12
// Two labels any closer would overlap: only the first one is kept
const MIN_LABEL_GAP_PX = 18

const HATCHED =
  'bg-[repeating-linear-gradient(45deg,var(--color-slate-700)_0_6px,transparent_6px_12px)]'

const plural = (count: number, singular: string, pluralForm: string) =>
  count >= 2 ? pluralForm : singular

type PlacedBlock = { block: TimelineBlock; top: number; height: number }
type Tick = { at: number; y: number }

/** Stacks the blocks top to bottom, each one tall enough to stay legible */
function placeBlocks(blocks: TimelineBlock[]): PlacedBlock[] {
  let top = 0

  return blocks.map((block) => {
    const minutes = (block.to - block.from) / MINUTE_MS
    const floor = block.kind === 'task' ? MIN_TASK_PX : MIN_WAIT_PX
    const placed = { block, top, height: Math.max(minutes * PX_PER_MINUTE, floor) }
    top = placed.top + placed.height + GAP_PX
    return placed
  })
}

/** Start and end of every block and pause, minus the labels that would overlap */
function axisTicks(placed: PlacedBlock[]): Tick[] {
  const ticks: Tick[] = []

  for (const { block, top, height } of placed) {
    const y = (at: number) => top + ((at - block.from) / (block.to - block.from)) * height
    ticks.push({ at: block.from, y: top })
    for (const pause of block.pauses) {
      ticks.push({ at: pause.from, y: y(pause.from) }, { at: pause.to, y: y(pause.to) })
    }
  }

  const last = placed.at(-1)
  if (last) ticks.push({ at: last.block.to, y: last.top + last.height })

  return ticks
    .sort((a, b) => a.y - b.y)
    .reduce<Tick[]>((kept, tick) => {
      const previous = kept.at(-1)
      if (!previous || tick.y - previous.y >= MIN_LABEL_GAP_PX) kept.push(tick)
      return kept
    }, [])
}

function Timeline({
  placed,
  tasks,
  onSelect,
}: {
  placed: PlacedBlock[]
  tasks: Task[]
  onSelect: (taskIndex: number) => void
}) {
  const last = placed.at(-1)!
  const height = last.top + last.height

  return (
    <div className="relative" style={{ height }}>
      <ol aria-label="Axe des temps" className="absolute inset-y-0 left-0 w-12">
        {axisTicks(placed).map((tick) => (
          <li
            key={tick.at}
            style={{ top: tick.y }}
            className="absolute right-0 -translate-y-1/2 text-xs text-slate-500 tabular-nums"
          >
            {formatOffset(tick.at)}
          </li>
        ))}
      </ol>

      <ol aria-label="Timeline" className="absolute inset-y-0 right-0 left-14">
        {placed.map(({ block, top, height }) =>
          block.kind === 'wait' ? (
            <li
              key={block.from}
              style={{ top, height }}
              className={`absolute inset-x-0 rounded-md ${HATCHED}`}
            >
              <span className="sr-only">Attente</span>
            </li>
          ) : (
            <li key={block.from} style={{ top, height }} className="absolute inset-x-0">
              <button
                type="button"
                // Explicit: the hatched pauses inside must not end up in the name
                aria-label={tasks[block.taskIndex]?.name}
                onClick={() => onSelect(block.taskIndex)}
                className="relative flex size-full items-start overflow-hidden rounded-md border-l-4 border-emerald-400 bg-emerald-950 px-3 py-2 text-left font-medium active:bg-emerald-900"
              >
                {tasks[block.taskIndex]?.name}
                {block.pauses.map((pause) => (
                  <span
                    key={pause.from}
                    style={{
                      top: `${((pause.from - block.from) / (block.to - block.from)) * 100}%`,
                      height: `${((pause.to - pause.from) / (block.to - block.from)) * 100}%`,
                    }}
                    className={`absolute inset-x-0 ${HATCHED}`}
                  >
                    <span className="sr-only">Pause</span>
                  </span>
                ))}
              </button>
            </li>
          ),
        )}
      </ol>
    </div>
  )
}

/** End of session: agenda-like timeline, per-task details and summary */
export function DebriefingScreen({
  tasks,
  timeline,
  onUpdateTask,
  onRestart,
  onClose,
}: {
  tasks: Task[]
  timeline: TimelineEntry[]
  onUpdateTask: (task: Task) => void
  onRestart: () => void
  onClose: () => void
}) {
  const [selected, setSelected] = useState<number | null>(null)
  // Felt difficulty is only kept for the screen's lifetime until a session history exists
  const [actualDifficulties, setActualDifficulties] = useState<
    Record<number, Difficulty | undefined>
  >({})

  const placed = placeBlocks(timelineBlocks(timeline))
  const { completedCount, taskCount, elapsedMs } = sessionSummary(timeline, tasks.length)
  const elapsedMinutes = Math.round(elapsedMs / MINUTE_MS)
  const selectedTask = selected === null ? undefined : tasks[selected]

  return (
    <main className="flex min-h-dvh flex-col bg-slate-900 px-6 pt-[max(2rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))] text-slate-50">
      {completedCount === 0 ? (
        <>
          <h1 className="text-3xl font-bold">Aucune tâche effectuée</h1>
          <p className="mt-2 mb-6 text-slate-300">Voulez-vous relancer depuis le début ?</p>
        </>
      ) : (
        <h1 className="mb-6 text-3xl font-bold">Bravo !</h1>
      )}

      {placed.length === 0 ? (
        <p className="text-slate-400">Aucune tâche démarrée.</p>
      ) : (
        <Timeline placed={placed} tasks={tasks} onSelect={setSelected} />
      )}

      <footer className="mt-auto flex flex-col gap-4 pt-8 text-center">
        <p className="text-slate-300">
          {completedCount} {plural(completedCount, 'tâche effectuée', 'tâches effectuées')} sur{' '}
          {taskCount}, temps passé : {elapsedMinutes} {plural(elapsedMinutes, 'minute', 'minutes')}
        </p>
        {completedCount === 0 && (
          <button
            type="button"
            onClick={onRestart}
            className="rounded-2xl bg-emerald-500 px-6 py-4 text-xl font-semibold text-slate-950 active:bg-emerald-400"
          >
            Relancer
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          className={
            completedCount === 0
              ? 'rounded-2xl border border-slate-600 px-6 py-4 text-xl font-semibold active:bg-slate-800'
              : 'rounded-2xl bg-emerald-500 px-6 py-4 text-xl font-semibold text-slate-950 active:bg-emerald-400'
          }
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
