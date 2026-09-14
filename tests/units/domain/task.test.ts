import { describe, expect, it } from 'vitest'
import { normalizeTaskName } from '@/domain/task'

describe('normalizeTaskName', () => {
  it('normalizes whitespace', () => {
    expect(normalizeTaskName('  Faire   la vaisselle ')).toBe('Faire la vaisselle')
  })

  it('rejects an empty name with a task-specific message', () => {
    expect(() => normalizeTaskName('  ')).toThrow('Le nom de la tâche est obligatoire')
  })
})
