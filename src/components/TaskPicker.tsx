import type { ReactNode } from 'react'
import { ScreenHeader } from '@/components/ui/ScreenHeader'
import type { Room } from '@/domain/room'
import { groupTasksByRoom } from '@/domain/taskGrouping'
import type { Task } from '@/domain/task'

export function TaskPicker({
  tasks,
  rooms,
  onSelect,
  footerExtra,
}: {
  /** The whole catalogue, to pick a single task from */
  tasks: Task[]
  rooms: Room[]
  onSelect: (id: string) => void
  /** Extra navigation rendered under the list (e.g. an Annuler link) */
  footerExtra?: ReactNode
}) {
  const groups = groupTasksByRoom(tasks, rooms)

  return (
    <main className="flex min-h-dvh flex-col bg-background p-6 pb-0">
      <ScreenHeader title="Choisir une tâche à chronométrer" className="mb-6" />

      <div className="flex-1">
        <div className="flex flex-col gap-6">
          {groups.map((group) => (
            <section key={group.id ?? 'no-room'}>
              <h2 className="mb-1 text-sm font-medium text-muted-foreground">{group.name}</h2>
              <ul className="flex flex-col divide-y divide-border">
                {group.tasks.map((task) => (
                  <li key={task.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(task.id)}
                      aria-label={`Chronométrer ${task.name}`}
                      className="block w-full py-3 text-left font-medium text-foreground"
                    >
                      {task.name}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <footer className="sticky bottom-0 -mx-6 mt-6 border-t border-border bg-background px-6 py-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center">
        {footerExtra}
      </footer>
    </main>
  )
}
