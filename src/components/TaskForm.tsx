import { useId, useState } from 'react'
import { DifficultyPicker } from '@/components/DifficultyPicker'
import { DurationPicker } from '@/components/DurationPicker'
import { EquipmentTagInput } from '@/components/EquipmentTagInput'
import { RoomSelect } from '@/components/RoomSelect'
import { Button } from '@/components/ui/Button'
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
  onSubmit: (task: Omit<Task, 'id'>) => void | Promise<unknown>
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
  // Persistence failures cannot reach the error boundary from an event handler; rethrow while rendering
  const [unexpected, setUnexpected] = useState<unknown>()
  // Entities created from the form may not be in the live lists yet; keep them so they render
  const [addedRooms, setAddedRooms] = useState<Room[]>([])
  const [addedEquipment, setAddedEquipment] = useState<Equipment[]>([])

  if (unexpected !== undefined) throw unexpected

  const addRoom = async (roomName: string) => {
    try {
      const room = await onAddRoom(roomName)
      setAddedRooms((previous) => [...previous, room])
      setRoomId(room.id)
    } catch (thrown) {
      setUnexpected(thrown)
    }
  }

  const addEquipment = async (equipmentName: string) => {
    try {
      const item = await onAddEquipment(equipmentName)
      setAddedEquipment((previous) => [...previous, item])
      setEquipmentIds((previous) =>
        previous.includes(item.id) ? previous : [...previous, item.id],
      )
    } catch (thrown) {
      setUnexpected(thrown)
    }
  }

  const submit = async () => {
    try {
      await onSubmit(
        // normalizeTask drops an empty equipment list itself
        normalizeTask({ name, expectedDuration, perceivedDifficulty, roomId, equipmentIds }),
      )
      setError(undefined)
    } catch (thrown) {
      if (thrown instanceof ValidationError) setError(thrown.message)
      else setUnexpected(thrown)
    }
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        void submit()
      }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor={nameId} className="text-sm font-medium text-muted-foreground">
          Nom
        </label>
        <input
          id={nameId}
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="rounded-xl border border-border bg-surface px-4 py-3 text-foreground"
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
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}

      <Button type="submit">Enregistrer</Button>
    </form>
  )
}
