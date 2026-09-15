import { ValidationError } from './validation'

/** Trims and collapses whitespace; throws `emptyMessage` (user-facing) when nothing is left */
export function normalizeName(name: string, emptyMessage: string): string {
  const normalized = name.trim().replace(/\s+/g, ' ')
  if (!normalized) throw new ValidationError(emptyMessage)
  return normalized
}

const collator = new Intl.Collator('fr', { sensitivity: 'base', numeric: true })

/** Sorts named entities the French way, ignoring case and accents, numbers in natural order */
export const byName = (a: { name: string }, b: { name: string }) => collator.compare(a.name, b.name)
