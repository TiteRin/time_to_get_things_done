import { Chip } from '@/components/ui/Chip'
import { difficultyLabels } from '@/domain/task'
import type { Difficulty } from '@/domain/task'

// Explicit order: easiest first
const ORDER: Difficulty[] = ['easy', 'medium', 'hard']
const OPTIONS = ORDER.map((value) => ({ value, label: difficultyLabels[value] }))

export function DifficultyPicker({
  value,
  onChange,
  label = 'Difficulté perçue',
}: {
  value?: Difficulty
  onChange: (value: Difficulty | undefined) => void
  label?: string
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {OPTIONS.map(({ value: option, label }) => {
        const selected = option === value
        return (
          <Chip
            key={option}
            selected={selected}
            onClick={() => onChange(selected ? undefined : option)}
          >
            {label}
          </Chip>
        )
      })}
    </div>
  )
}
