import { describe, expect, it } from 'vitest'
import { byName, normalizeName } from '@/domain/name'
import { ValidationError } from '@/domain/validation'

describe('normalizeName', () => {
  it('trims and collapses whitespace', () => {
    expect(normalizeName('  Salle   de bain ', 'vide')).toBe('Salle de bain')
  })

  it.each(['', '   '])('throws a ValidationError with the given message (%j)', (name) => {
    expect(() => normalizeName(name, 'Nom obligatoire')).toThrow(
      new ValidationError('Nom obligatoire'),
    )
    expect(() => normalizeName(name, 'Nom obligatoire')).toThrow(ValidationError)
  })
})

describe('byName', () => {
  it('sorts by name ignoring case and accents', () => {
    const names = [{ name: 'Vider' }, { name: 'Écrire' }, { name: 'aspirer' }, { name: 'Faire' }]
      .sort(byName)
      .map((entity) => entity.name)

    expect(names).toEqual(['aspirer', 'Écrire', 'Faire', 'Vider'])
  })

  it('sorts numbers inside names naturally', () => {
    const names = [{ name: 'Chambre 10' }, { name: 'Chambre 2' }].sort(byName).map((e) => e.name)

    expect(names).toEqual(['Chambre 2', 'Chambre 10'])
  })
})
