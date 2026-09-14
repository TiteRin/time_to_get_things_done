import type { EntityTable } from 'dexie'
import type { TtgtdDatabase } from '@/db/database'
import { byName, normalizeName } from '@/domain/name'

type NamedEntity = { id: string; name: string }

/** Shared logic for user-customizable lists (rooms, equipment) */
export function namedEntityRepository<T extends NamedEntity>(
  tableOf: (db: TtgtdDatabase) => EntityTable<T, 'id'>,
  emptyNameMessage: string,
) {
  return {
    async list(db: TtgtdDatabase): Promise<T[]> {
      return (await tableOf(db).toArray()).sort(byName)
    },

    /** Returns the entity with the same name (ignoring case and accents) or creates it */
    async findOrCreate(db: TtgtdDatabase, rawName: string): Promise<T> {
      const name = normalizeName(rawName, emptyNameMessage)
      const table = tableOf(db)

      return db.transaction('rw', table, async () => {
        const existing = (await table.toArray()).find((entity) => byName(entity, { name }) === 0)
        if (existing) return existing

        const created = { id: crypto.randomUUID(), name } as T
        await table.add(created)
        return created
      })
    },
  }
}
