import type { ReactNode } from 'react'
import type { Room } from '@/domain/room'
import type { Task } from '@/domain/task'
import { groupTasksByRoom } from '@/domain/taskGrouping'

export type GroupedTaskListProps = {
  tasks: Task[]
  /** Used for the group headings and their order; tasks with an unknown room go under "Aucune pièce". */
  rooms: Room[]
  /** Content of one row — usually a button acting on the task. */
  renderRow: (task: Task) => ReactNode
  /** Appended to every `<li>`, e.g. to lay the row out as a flex line. */
  rowClassName?: string
}

/**
 * Tasks grouped by room: one section per room (sorted by name, "Aucune pièce" last,
 * empty rooms hidden), each with a small heading and a divided list. The caller only
 * decides what a row contains.
 */
export function GroupedTaskList({ tasks, rooms, renderRow, rowClassName }: GroupedTaskListProps) {
  return (
    <div className="flex flex-col gap-6">
      {groupTasksByRoom(tasks, rooms).map((group) => (
        <section key={group.id ?? 'no-room'}>
          <h2 className="mb-1 text-sm font-medium text-muted-foreground">{group.name}</h2>
          <ul className="flex flex-col divide-y divide-border">
            {group.tasks.map((task) => (
              <li key={task.id} className={rowClassName}>
                {renderRow(task)}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
