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

/** Trims and collapses whitespace; throws when nothing is left (the message is user-facing) */
export function normalizeTaskName(name: string): string {
  const normalized = name.trim().replace(/\s+/g, ' ')
  if (!normalized) throw new Error('Le nom de la tâche est obligatoire')
  return normalized
}
