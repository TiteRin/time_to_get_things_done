export type Difficulty = 'easy' | 'medium' | 'hard'

export type Task = {
  id: string
  name: string
  /** Expected duration, in minutes */
  expectedDuration: number
  perceivedDifficulty: Difficulty
  room?: string
  sharedEquipment?: string[]
}
