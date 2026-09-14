import { describe, expect, it } from 'vitest'
import { normalizeTaskName } from '@/domain/task'

describe('normalizeTaskName', () => {
  it('trims and collapses whitespace', () => {
    expect(normalizeTaskName('  Faire   la vaisselle ')).toBe('Faire la vaisselle')
  })

  it.each(['', '   '])('rejects an empty name (%j)', (name) => {
    expect(() => normalizeTaskName(name)).toThrow('Le nom de la tâche est obligatoire')
  })
})
