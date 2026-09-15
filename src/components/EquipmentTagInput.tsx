import { useId, useState } from 'react'
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
      <label htmlFor={inputId} className="text-sm font-medium text-slate-300">
        Ajouter du matériel
      </label>
      {selected.length > 0 && (
        <ul aria-label="Matériel sélectionné" className="flex flex-wrap gap-2">
          {selected.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-2 rounded-xl bg-slate-700 px-3 py-1 text-slate-100"
            >
              {item.name}
              <button
                type="button"
                aria-label={`Retirer ${item.name}`}
                onClick={() => onChange(value.filter((id) => id !== item.id))}
                className="text-slate-400"
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
          onKeyDown={(event) => event.key === 'Enter' && submitNewEquipment()}
          className="flex-1 rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100"
        />
        <button
          type="button"
          onClick={submitNewEquipment}
          className="rounded-xl bg-emerald-500 px-4 py-3 font-medium text-slate-950"
        >
          Ajouter
        </button>
      </div>
    </div>
  )
}
