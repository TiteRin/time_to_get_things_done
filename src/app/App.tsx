import { ExecutionPage } from '@/pages/ExecutionPage'
import type { Task } from '@/domain/task'

export function App({ tasks }: { tasks?: Task[] }) {
  return <ExecutionPage tasks={tasks} />
}
