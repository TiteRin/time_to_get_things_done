import { useId, useState } from 'react'
import { Button } from '@/components/ui/Button'
import type { Equipment } from '@/domain/equipment'

export function EquipmentTagInput({
  equipment,
  value,
  onChange,
  onAddEquipment,
}: {
  equipment: Equipment[]
  value: string[]
  onChange: (equipmentIds: string[]) => void
  onAddEquipment: (name: string) => void
}) {
  const inputId = useId()
  const [name, setName] = useState('')
  const selected = value.flatMap((id) => equipment.find((item) => item.id === id) ?? [])

  const submitNewEquipment = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    onAddEquipment(trimmed)
    setName('')
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-sm font-medium text-muted-foreground">
        Ajouter du matériel
      </label>
      {selected.length > 0 && (
        <ul aria-label="Matériel sélectionné" className="flex flex-wrap gap-2">
          {selected.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-2 rounded-xl bg-surface-alt px-3 py-1 text-foreground"
            >
              {item.name}
              <button
                type="button"
                aria-label={`Retirer ${item.name}`}
                onClick={() => onChange(value.filter((id) => id !== item.id))}
                className="text-muted-foreground"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <input
          id={inputId}
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== 'Enter') return
            event.preventDefault()
            submitNewEquipment()
          }}
          className="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-foreground"
        />
        <Button onClick={submitNewEquipment}>Ajouter</Button>
      </div>
    </div>
  )
}
