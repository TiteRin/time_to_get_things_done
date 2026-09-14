import type { ReactNode } from 'react'
import { afterEach } from 'vitest'
import { TtgtdDatabase } from '@/db/database'
import { DatabaseProvider } from '@/db/DatabaseProvider'

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

/** renderHook/render wrapper injecting the given database */
export function databaseWrapper(db: TtgtdDatabase) {
  return function DatabaseWrapper({ children }: { children: ReactNode }) {
    return <DatabaseProvider db={db}>{children}</DatabaseProvider>
  }
}
