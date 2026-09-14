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
