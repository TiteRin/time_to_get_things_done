import { normalizeName } from './name'

export type Difficulty = 'easy' | 'medium' | 'hard'

/** Only the name is required: a task is usable before the user configures anything else */
export type Task = {
  id: string
  name: string
  /** Expected duration, in minutes */
  expectedDuration?: number
  perceivedDifficulty?: Difficulty
  roomId?: string
  equipmentIds?: string[]
}

export const normalizeTaskName = (name: string) =>
  normalizeName(name, 'Le nom de la tâche est obligatoire')

/** Validates a task (with or without id) before storing it; cleared fields are dropped, not kept as undefined */
export function normalizeTask<T extends Omit<Task, 'id'>>(task: T): T {
  const normalized = Object.fromEntries(
    Object.entries(task).filter(([, value]) => value !== undefined),
  ) as T
  return { ...normalized, name: normalizeTaskName(task.name) }
}
