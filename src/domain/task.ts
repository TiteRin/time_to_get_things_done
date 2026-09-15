import { normalizeName } from './name'
import { ValidationError } from './validation'

export type Difficulty = 'easy' | 'medium' | 'hard'

export const difficultyLabels: Record<Difficulty, string> = {
  easy: 'Facile',
  medium: 'Moyen',
  hard: 'Difficile',
}

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

  const duration = normalized.expectedDuration
  if (duration !== undefined && !(Number.isInteger(duration) && duration > 0)) {
    throw new ValidationError('La durée doit être un nombre entier de minutes supérieur à zéro')
  }

  if (normalized.equipmentIds) {
    const equipmentIds = [...new Set(normalized.equipmentIds)]
    if (equipmentIds.length > 0) normalized.equipmentIds = equipmentIds
    else delete normalized.equipmentIds
  }

  return { ...normalized, name: normalizeTaskName(task.name) }
}
