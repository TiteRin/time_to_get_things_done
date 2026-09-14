import { describe, expect, it } from 'vitest'
import { normalizeTask, normalizeTaskName } from '@/domain/task'
import { ValidationError } from '@/domain/validation'

describe('normalizeTaskName', () => {
  it('normalizes whitespace', () => {
    expect(normalizeTaskName('  Faire   la vaisselle ')).toBe('Faire la vaisselle')
  })

  it('rejects an empty name with a task-specific message', () => {
    expect(() => normalizeTaskName('  ')).toThrow('Le nom de la tâche est obligatoire')
  })
})

describe('normalizeTask', () => {
  it('normalizes the name and keeps filled fields', () => {
    expect(
      normalizeTask({
        id: 't1',
        name: ' Faire  la vaisselle',
        expectedDuration: 15,
        perceivedDifficulty: 'medium',
        roomId: 'cuisine',
        equipmentIds: ['eponge'],
      }),
    ).toStrictEqual({
      id: 't1',
      name: 'Faire la vaisselle',
      expectedDuration: 15,
      perceivedDifficulty: 'medium',
      roomId: 'cuisine',
      equipmentIds: ['eponge'],
    })
  })

  it('drops cleared fields instead of storing undefined keys', () => {
    expect(
      normalizeTask({
        name: 'Aspirer',
        expectedDuration: undefined,
        perceivedDifficulty: undefined,
        roomId: undefined,
        equipmentIds: undefined,
      }),
    ).toStrictEqual({ name: 'Aspirer' })
  })

  it.each([0, -5, 2.5, Number.NaN])('rejects an invalid duration (%s)', (expectedDuration) => {
    expect(() => normalizeTask({ name: 'Aspirer', expectedDuration })).toThrow(
      new ValidationError('La durée doit être un nombre entier de minutes supérieur à zéro'),
    )
  })
})
