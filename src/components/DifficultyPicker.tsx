import { difficultyLabels } from '@/domain/task'
import type { Difficulty } from '@/domain/task'

// Explicit order: easiest first
const ORDER: Difficulty[] = ['easy', 'medium', 'hard']
const OPTIONS = ORDER.map((value) => ({ value, label: difficultyLabels[value] }))

export function DifficultyPicker({
  value,
  onChange,
}: {
  value?: Difficulty
  onChange: (value: Difficulty | undefined) => void
}) {
  return (
    <div role="group" aria-label="Difficulté perçue" className="flex flex-wrap gap-2">
      {OPTIONS.map(({ value: option, label }) => {
        const selected = option === value
        return (
          <button
            key={option}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(selected ? undefined : option)}
            className={`rounded-full border px-4 py-2 text-sm font-medium ${
              selected
                ? 'border-emerald-400 bg-emerald-400 text-slate-950'
                : 'border-slate-600 text-slate-200 active:bg-slate-800'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
