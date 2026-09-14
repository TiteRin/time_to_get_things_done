import { ValidationError } from './validation'

/** Trims and collapses whitespace; throws `emptyMessage` (user-facing) when nothing is left */
export function normalizeName(name: string, emptyMessage: string): string {
  const normalized = name.trim().replace(/\s+/g, ' ')
  if (!normalized) throw new ValidationError(emptyMessage)
  return normalized
}

/** Sorts named entities the French way, ignoring case and accents */
export const byName = (a: { name: string }, b: { name: string }) =>
  a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' })
