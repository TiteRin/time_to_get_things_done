import type { Room } from '@/domain/room'
import type { Task } from '@/domain/task'
import { byName } from '@/domain/name'

export function TaskList({
  tasks,
  rooms,
  onSelect,
}: {
  tasks: Task[]
  rooms: Room[]
  onSelect?: (task: Task) => void
}) {
  const roomName = (roomId?: string) => rooms.find((room) => room.id === roomId)?.name

  return (
    <ul className="flex flex-col divide-y divide-slate-700">
      {[...tasks].sort(byName).map((task) => (
        <li key={task.id}>
          <button
            type="button"
            onClick={() => onSelect?.(task)}
            className="flex w-full flex-col gap-1 py-3 text-left"
          >
            <span className="font-medium text-slate-100">{task.name}</span>
            {roomName(task.roomId) && (
              <span className="text-sm text-slate-400">{roomName(task.roomId)}</span>
            )}
          </button>
        </li>
      ))}
    </ul>
  )
}
