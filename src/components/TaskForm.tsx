import { useId, useState } from 'react'
import { DifficultyPicker } from '@/components/DifficultyPicker'
import { DurationPicker } from '@/components/DurationPicker'
import { EquipmentTagInput } from '@/components/EquipmentTagInput'
import { RoomSelect } from '@/components/RoomSelect'
import type { Equipment } from '@/domain/equipment'
import type { Room } from '@/domain/room'
import type { Difficulty, Task } from '@/domain/task'
import { normalizeTask } from '@/domain/task'
import { ValidationError } from '@/domain/validation'

function mergeById<T extends { id: string }>(base: T[], added: T[]): T[] {
  return [...base, ...added.filter((item) => !base.some(({ id }) => id === item.id))]
}

export function TaskForm({
  task,
  rooms,
  equipment,
  onSubmit,
  onAddRoom,
  onAddEquipment,
}: {
  task?: Task
  rooms: Room[]
  equipment: Equipment[]
  onSubmit: (task: Omit<Task, 'id'>) => void
  onAddRoom: (name: string) => Promise<Room>
  onAddEquipment: (name: string) => Promise<Equipment>
}) {
  const nameId = useId()
  const [name, setName] = useState(task?.name ?? '')
  const [expectedDuration, setExpectedDuration] = useState(task?.expectedDuration)
  const [perceivedDifficulty, setPerceivedDifficulty] = useState<Difficulty | undefined>(
    task?.perceivedDifficulty,
  )
  const [roomId, setRoomId] = useState(task?.roomId)
  const [equipmentIds, setEquipmentIds] = useState(task?.equipmentIds ?? [])
  const [error, setError] = useState<string>()
  // Entities created from the form may not be in the live lists yet; keep them so they render
  const [addedRooms, setAddedRooms] = useState<Room[]>([])
  const [addedEquipment, setAddedEquipment] = useState<Equipment[]>([])

  const addRoom = async (roomName: string) => {
    const room = await onAddRoom(roomName)
    setAddedRooms((previous) => [...previous, room])
    setRoomId(room.id)
  }

  const addEquipment = async (equipmentName: string) => {
    const item = await onAddEquipment(equipmentName)
    setAddedEquipment((previous) => [...previous, item])
    setEquipmentIds((previous) => (previous.includes(item.id) ? previous : [...previous, item.id]))
  }

  const submit = () => {
    try {
      onSubmit(
        normalizeTask({
          name,
          expectedDuration,
          perceivedDifficulty,
          roomId,
          equipmentIds: equipmentIds.length > 0 ? equipmentIds : undefined,
        }),
      )
      setError(undefined)
    } catch (thrown) {
      if (!(thrown instanceof ValidationError)) throw thrown
      setError(thrown.message)
    }
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor={nameId} className="text-sm font-medium text-slate-300">
          Nom
        </label>
        <input
          id={nameId}
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100"
        />
      </div>

      <DurationPicker value={expectedDuration} onChange={setExpectedDuration} />
      <DifficultyPicker value={perceivedDifficulty} onChange={setPerceivedDifficulty} />
      <RoomSelect
        rooms={mergeById(rooms, addedRooms)}
        value={roomId}
        onChange={setRoomId}
        onAddRoom={addRoom}
      />
      <EquipmentTagInput
        equipment={mergeById(equipment, addedEquipment)}
        value={equipmentIds}
        onChange={setEquipmentIds}
        onAddEquipment={addEquipment}
      />

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="rounded-xl bg-emerald-500 px-4 py-3 font-medium text-slate-950"
      >
        Enregistrer
      </button>
    </form>
  )
}
