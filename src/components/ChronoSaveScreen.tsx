import { useState } from 'react'
import { DifficultyPicker } from '@/components/DifficultyPicker'
import { minutesFromMs } from '@/domain/duration'
import type { Difficulty, Task } from '@/domain/task'

/** Presents the timed durations for one task; reusable as-is by the future Débriefing screen */
export function ChronoSaveScreen({
  task,
  totalMs,
  actualMs,
  onReplace,
  onSkip,
}: {
  task: Task
  /** Wall-clock duration of the chrono, pauses included */
  totalMs: number
  /** Duration actually spent running, pauses excluded */
  actualMs: number
  onReplace: (minutes: number, difficulty?: Difficulty) => void
  onSkip: (difficulty?: Difficulty) => void
}) {
  const [difficulty, setDifficulty] = useState(task.perceivedDifficulty)
  const totalMinutes = minutesFromMs(totalMs)
  const actualMinutes = minutesFromMs(actualMs)

  return (
    <main className="flex min-h-dvh flex-col gap-6 bg-slate-900 p-6 text-slate-50">
      <h1 className="text-xl font-semibold">Mettre à jour « {task.name} » ?</h1>

      <p className="text-slate-400">
        {task.expectedDuration !== undefined
          ? `Temps prévu initialement : ${task.expectedDuration} min`
          : 'Aucune durée prévue pour le moment'}
      </p>

      <DifficultyPicker value={difficulty} onChange={setDifficulty} />

      <div className="flex flex-col gap-3">
        <button
          type="button"
          disabled={totalMinutes === 0}
          onClick={() => onReplace(totalMinutes, difficulty)}
          className="rounded-xl bg-emerald-500 py-3 font-medium text-slate-950 disabled:opacity-40"
        >
          Remplacer par {totalMinutes} min (temps total)
        </button>
        <button
          type="button"
          disabled={actualMinutes === 0}
          onClick={() => onReplace(actualMinutes, difficulty)}
          className="rounded-xl bg-emerald-500 py-3 font-medium text-slate-950 disabled:opacity-40"
        >
          Remplacer par {actualMinutes} min (temps effectif)
        </button>
        <button
          type="button"
          onClick={() => onSkip(difficulty)}
          className="rounded-xl border border-slate-600 py-3 font-medium text-slate-100"
        >
          Ne pas remplacer
        </button>
      </div>
    </main>
  )
}
