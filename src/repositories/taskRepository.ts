import type { TtgtdDatabase } from '@/db/database'
import { normalizeTaskName, type Task } from '@/domain/task'

export type TaskInput = Omit<Task, 'id'>

const byName = (a: { name: string }, b: { name: string }) =>
  a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' })

export async function listTasks(db: TtgtdDatabase): Promise<Task[]> {
  const tasks = await db.tasks.toArray()
  return tasks.sort(byName)
}

export async function createTask(db: TtgtdDatabase, input: TaskInput): Promise<Task> {
  const task: Task = { ...input, id: crypto.randomUUID(), name: normalizeTaskName(input.name) }
  await db.tasks.add(task)
  return task
}
