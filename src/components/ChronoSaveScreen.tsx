import { useState } from 'react'
import { DifficultyPicker } from '@/components/DifficultyPicker'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/Button'
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
    <main className="flex min-h-dvh flex-col gap-6 bg-background p-6 text-foreground">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Mettre à jour « {task.name} » ?</h1>
        <ThemeToggle />
      </div>

      <p className="text-muted-foreground">
        {task.expectedDuration !== undefined
          ? `Temps prévu initialement : ${task.expectedDuration} min`
          : 'Aucune durée prévue pour le moment'}
      </p>

      <DifficultyPicker value={difficulty} onChange={setDifficulty} />

      <div className="flex flex-col gap-3">
        <Button
          disabled={totalMinutes === 0}
          onClick={() => onReplace(totalMinutes, difficulty)}
        >
          Remplacer par {totalMinutes} min (temps total)
        </Button>
        <Button
          disabled={actualMinutes === 0}
          onClick={() => onReplace(actualMinutes, difficulty)}
        >
          Remplacer par {actualMinutes} min (temps effectif)
        </Button>
        <Button variant="secondary" onClick={() => onSkip(difficulty)}>
          Ne pas remplacer
        </Button>
      </div>
    </main>
  )
}
