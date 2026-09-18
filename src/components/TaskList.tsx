import { GroupedTaskList } from '@/components/ui/GroupedTaskList'
import type { Room } from '@/domain/room'
import type { Task } from '@/domain/task'

export function TaskList({
  tasks,
  rooms,
  onSelect,
}: {
  tasks: Task[]
  rooms: Room[]
  onSelect?: (task: Task) => void
}) {
  return (
    <GroupedTaskList
      tasks={tasks}
      rooms={rooms}
      renderRow={(task) => (
        <button
          type="button"
          onClick={() => onSelect?.(task)}
          className="w-full py-3 text-left font-medium text-foreground"
        >
          {task.name}
        </button>
      )}
    />
  )
}
