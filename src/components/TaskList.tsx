import { GroupedTaskList } from '@/components/ui/GroupedTaskList'
import { TaskItem } from '@/components/ui/TaskItem'
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
      renderRow={(task) => <TaskItem name={task.name} onClick={() => onSelect?.(task)} />}
    />
  )
}
