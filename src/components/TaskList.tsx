import type { Room } from '@/domain/room'
import type { Task } from '@/domain/task'
import { groupTasksByRoom } from '@/domain/taskGrouping'

export function TaskList({
  tasks,
  rooms,
  onSelect,
}: {
  tasks: Task[]
  rooms: Room[]
  onSelect?: (task: Task) => void
}) {
  const groups = groupTasksByRoom(tasks, rooms)

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <section key={group.id ?? 'no-room'}>
          <h2 className="mb-1 text-sm font-medium text-muted-foreground">{group.name}</h2>
          <ul className="flex flex-col divide-y divide-border">
            {group.tasks.map((task) => (
              <li key={task.id}>
                <button
                  type="button"
                  onClick={() => onSelect?.(task)}
                  className="w-full py-3 text-left font-medium text-foreground"
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
