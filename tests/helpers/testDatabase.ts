import { afterEach } from 'vitest'
import { TtgtdDatabase } from '@/db/database'

/**
 * Returns a function opening isolated databases (random names on fake-indexeddb),
 * all deleted after each test.
 */
export function setupTestDatabases() {
  const opened: TtgtdDatabase[] = []

  afterEach(async () => {
    await Promise.all(opened.splice(0).map((db) => db.delete()))
  })

  return (name: string = crypto.randomUUID()) => {
    const db = new TtgtdDatabase(name)
    opened.push(db)
    return db
  }
}
