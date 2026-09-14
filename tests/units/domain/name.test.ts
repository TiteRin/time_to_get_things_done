import { describe, expect, it } from 'vitest'
import { byName, normalizeName } from '@/domain/name'

describe('normalizeName', () => {
  it('trims and collapses whitespace', () => {
    expect(normalizeName('  Salle   de bain ', 'vide')).toBe('Salle de bain')
  })

  it.each(['', '   '])('throws the given message for an empty name (%j)', (name) => {
    expect(() => normalizeName(name, 'Nom obligatoire')).toThrow('Nom obligatoire')
  })
})

describe('byName', () => {
  it('sorts by name ignoring case and accents', () => {
    const names = [{ name: 'Vider' }, { name: 'Écrire' }, { name: 'aspirer' }, { name: 'Faire' }]
      .sort(byName)
      .map((entity) => entity.name)

    expect(names).toEqual(['aspirer', 'Écrire', 'Faire', 'Vider'])
  })
})
