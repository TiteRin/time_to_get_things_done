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
  const groups = [...[...rooms].sort(byName), { id: undefined, name: 'Aucune pièce' }]
    .map((room) => ({
      ...room,
      tasks: tasks.filter((task) => task.roomId === room.id).sort(byName),
    }))
    .filter((group) => group.tasks.length > 0)

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <section key={group.id ?? 'no-room'}>
          <h2 className="mb-1 text-sm font-medium text-slate-400">{group.name}</h2>
          <ul className="flex flex-col divide-y divide-slate-700">
            {group.tasks.map((task) => (
              <li key={task.id}>
                <button
                  type="button"
                  onClick={() => onSelect?.(task)}
                  className="w-full py-3 text-left font-medium text-slate-100"
                >
                  {task.name}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
