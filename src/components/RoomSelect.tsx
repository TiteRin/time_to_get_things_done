import { useId, useState } from 'react'
import type { Room } from '@/domain/room'

export function RoomSelect({
  rooms,
  value,
  onChange,
  onAddRoom,
}: {
  rooms: Room[]
  value?: string
  onChange: (roomId: string | undefined) => void
  onAddRoom: (name: string) => void
}) {
  const selectId = useId()
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')

  const submitNewRoom = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    onAddRoom(trimmed)
    setName('')
    setAdding(false)
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={selectId} className="text-sm font-medium text-slate-300">
        Pièce
      </label>
      <select
        id={selectId}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value || undefined)}
        className="rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100"
      >
        <option value="">Aucune pièce</option>
        {rooms.map((room) => (
          <option key={room.id} value={room.id}>
            {room.name}
          </option>
        ))}
      </select>

      {adding ? (
        <div className="flex gap-2">
          <input
            type="text"
            aria-label="Nom de la pièce"
            value={name}
            autoFocus
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== 'Enter') return
              event.preventDefault()
              submitNewRoom()
            }}
            className="flex-1 rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100"
          />
          <button
            type="button"
            onClick={submitNewRoom}
            className="rounded-xl bg-emerald-500 px-4 py-3 font-medium text-slate-950"
          >
            Ajouter
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="self-start text-sm text-emerald-400 underline"
        >
          Nouvelle pièce
        </button>
      )}
    </div>
  )
}
