import { use } from 'react'
import type { TtgtdDatabase } from '@/db/database'
import { DatabaseContext } from '@/db/databaseContext'

export function useDatabase(): TtgtdDatabase {
  const db = use(DatabaseContext)
  if (!db) throw new Error('useDatabase must be used inside a DatabaseProvider')
  return db
}
