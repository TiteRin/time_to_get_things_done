import { Chip } from '@/components/ui/Chip'

const PRESETS =[5, 10, 15, 20, 30, 45, 60]

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest ? `${hours} h ${rest}` : `${hours} h`
}

export function DurationPicker({
  value,
  onChange,
}: {
  value?: number
  onChange: (value: number | undefined) => void
}) {
  const options =
    value === undefined || PRESETS.includes(value)
      ? PRESETS
      : [...PRESETS, value].sort((a, b) => a - b)

  return (
    <div role="group" aria-label="Durée prévue" className="flex flex-wrap gap-2">
      {options.map((minutes) => {
        const selected = minutes === value
        return (
          <Chip
            key={minutes}
            selected={selected}
            onClick={() => onChange(selected ? undefined : minutes)}
            className="tabular-nums"
          >
            {formatDuration(minutes)}
          </Chip>
        )
      })}
    </div>
  )
}
