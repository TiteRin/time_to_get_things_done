import type { EntityTable } from 'dexie'
import { byName, normalizeName } from '@/domain/name'

type NamedEntity = { id: string; name: string }

/** Shared logic for user-customizable lists (rooms, equipment) */
export function namedEntityRepository<T extends NamedEntity>(emptyNameMessage: string) {
  return {
    async list(table: EntityTable<T, 'id'>): Promise<T[]> {
      return (await table.toArray()).sort(byName)
    },

    /** Returns the entity with the same name (ignoring case and accents) or creates it */
    async findOrCreate(table: EntityTable<T, 'id'>, rawName: string): Promise<T> {
      const name = normalizeName(rawName, emptyNameMessage)

      return table.db.transaction('rw', table, async () => {
        const existing = (await table.toArray()).find((entity) => byName(entity, { name }) === 0)
        if (existing) return existing

        const created = { id: crypto.randomUUID(), name } as T
        await table.add(created)
        return created
      })
    },
  }
}
