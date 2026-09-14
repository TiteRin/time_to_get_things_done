import type { TtgtdDatabase } from '@/db/database'
import type { Task } from '@/domain/task'

const byName = (a: { name: string }, b: { name: string }) =>
  a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' })

export async function listTasks(db: TtgtdDatabase): Promise<Task[]> {
  const tasks = await db.tasks.toArray()
  return tasks.sort(byName)
}
