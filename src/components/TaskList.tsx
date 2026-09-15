import type { Room } from '@/domain/room'
import type { Task } from '@/domain/task'
import { byName } from '@/domain/name'

export function TaskList({ tasks, rooms }: { tasks: Task[]; rooms: Room[] }) {
  const roomName = (roomId?: string) => rooms.find((room) => room.id === roomId)?.name

  return (
    <ul className="flex flex-col divide-y divide-slate-700">
      {[...tasks].sort(byName).map((task) => (
        <li key={task.id} className="flex flex-col gap-1 py-3">
          <span className="font-medium text-slate-100">{task.name}</span>
          {roomName(task.roomId) && (
            <span className="text-sm text-slate-400">{roomName(task.roomId)}</span>
          )}
        </li>
      ))}
    </ul>
  )
}
