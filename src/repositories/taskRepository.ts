import type { TtgtdDatabase } from '@/db/database'
import { byName } from '@/domain/name'
import { normalizeTaskName, type Task } from '@/domain/task'

export type TaskInput = Omit<Task, 'id'>

export async function listTasks(db: TtgtdDatabase): Promise<Task[]> {
  const tasks = await db.tasks.toArray()
  return tasks.sort(byName)
}

export async function createTask(db: TtgtdDatabase, input: TaskInput): Promise<Task> {
  const task: Task = { ...input, id: crypto.randomUUID(), name: normalizeTaskName(input.name) }
  await db.tasks.add(task)
  return task
}

/** Replaces the whole task: fields missing from `task` are cleared */
export async function updateTask(db: TtgtdDatabase, task: Task): Promise<Task> {
  const updated: Task = { ...task, name: normalizeTaskName(task.name) }

  await db.transaction('rw', db.tasks, async () => {
    if (!(await db.tasks.get(task.id))) throw new Error('Tâche introuvable')
    await db.tasks.put(updated)
  })

  return updated
}

export async function deleteTask(db: TtgtdDatabase, id: Task['id']): Promise<void> {
  await db.tasks.delete(id)
}
