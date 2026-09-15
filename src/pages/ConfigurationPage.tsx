import { TaskList } from '@/components/TaskList'
import { useRooms } from '@/hooks/useRooms'
import { useTasks } from '@/hooks/useTasks'

export function ConfigurationPage() {
  const { tasks } = useTasks()
  const { rooms } = useRooms()

  return (
    <main className="min-h-dvh bg-slate-900 p-6">
      <h1 className="mb-6 text-xl font-semibold text-slate-100">Configuration</h1>
      <TaskList tasks={tasks ?? []} rooms={rooms ?? []} />
    </main>
  )
}
