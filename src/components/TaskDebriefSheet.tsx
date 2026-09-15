import { useState, type ReactNode } from 'react'
import { formatDuration } from '@/domain/debriefing'
import { difficultyLabels, type Difficulty, type Task } from '@/domain/task'
import { DifficultyPicker } from './DifficultyPicker'

const MINUTE_MS = 60_000

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-800 py-3">
      <dt className="text-slate-400">{label}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  )
}

const editableClass = 'underline decoration-dotted underline-offset-4 active:text-emerald-400'

/** Bottom sheet detailing one task of the finished session */
export function TaskDebriefSheet({
  task,
  totalMs,
  effectiveMs,
  actualDifficulty,
  onActualDifficultyChange,
  onUpdateTask,
  onClose,
}: {
  task: Task
  totalMs: number
  effectiveMs: number
  /** Difficulty felt during this session (not persisted yet) */
  actualDifficulty?: Difficulty
  onActualDifficultyChange: (value: Difficulty | undefined) => void
  onUpdateTask: (task: Task) => void
  onClose: () => void
}) {
  const [editing, setEditing] = useState<'duration' | 'difficulty' | null>(null)
  const [minutes, setMinutes] = useState('')
  const parsedMinutes = Number(minutes)
  const validMinutes = Number.isInteger(parsedMinutes) && parsedMinutes > 0

  const editDuration = () => {
    setMinutes(String(Math.max(1, Math.round(effectiveMs / MINUTE_MS))))
    setEditing('duration')
  }

  const saveDuration = () => {
    onUpdateTask({ ...task, expectedDuration: parsedMinutes })
    setEditing(null)
  }

  return (
    <div className="fixed inset-0 z-10 flex flex-col justify-end bg-slate-950/70" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={task.name}
        onClick={(event) => event.stopPropagation()}
        className="animate-slide-up rounded-t-3xl bg-slate-900 px-6 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-slate-50"
      >
        <div className="mb-2 flex items-start justify-between gap-4">
          <h2 className="text-2xl font-bold">{task.name}</h2>
          <button
            type="button"
            aria-label="Fermer le détail"
            onClick={onClose}
            className="px-2 text-2xl text-slate-400 active:text-slate-100"
          >
            ×
          </button>
        </div>

        <dl>
          <Row label="Durée totale">{formatDuration(totalMs)}</Row>
          <Row label="Durée effective">{formatDuration(effectiveMs)}</Row>
          <Row label="Durée prévue">
            {editing === 'duration' ? (
              <form
                className="flex items-center gap-2"
                onSubmit={(event) => {
                  event.preventDefault()
                  if (validMinutes) saveDuration()
                }}
              >
                <input
                  type="number"
                  min={1}
                  step={1}
                  inputMode="numeric"
                  aria-label="Durée prévue (minutes)"
                  value={minutes}
                  onChange={(event) => setMinutes(event.target.value)}
                  className="w-20 rounded-lg border border-slate-600 bg-slate-800 px-2 py-1 text-right tabular-nums"
                />
                <button
                  type="submit"
                  disabled={!validMinutes}
                  className="rounded-lg bg-emerald-500 px-3 py-1 text-slate-950 disabled:opacity-50"
                >
                  Enregistrer
                </button>
              </form>
            ) : (
              <button
                type="button"
                aria-label="Modifier la durée prévue"
                onClick={editDuration}
                className={editableClass}
              >
                {task.expectedDuration
                  ? formatDuration(task.expectedDuration * MINUTE_MS)
                  : 'non renseignée'}
              </button>
            )}
          </Row>
          <Row label="Difficulté">
            <button
              type="button"
              aria-label="Renseigner la difficulté"
              onClick={() => setEditing(editing === 'difficulty' ? null : 'difficulty')}
              className={editableClass}
            >
              {task.perceivedDifficulty
                ? difficultyLabels[task.perceivedDifficulty]
                : 'non renseignée'}
            </button>
          </Row>
        </dl>

        {editing === 'difficulty' && (
          <div className="mt-4 flex flex-col gap-4">
            <div>
              <p className="mb-2 text-sm text-slate-400">Comment l'avez-vous vécue cette fois ?</p>
              <DifficultyPicker
                label="Difficulté réelle"
                value={actualDifficulty}
                onChange={onActualDifficultyChange}
              />
            </div>
            <div>
              <p className="mb-2 text-sm text-slate-400">Corriger la difficulté perçue</p>
              <DifficultyPicker
                value={task.perceivedDifficulty}
                onChange={(perceivedDifficulty) => onUpdateTask({ ...task, perceivedDifficulty })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
