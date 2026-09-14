import type { ReactNode } from 'react'
import type { TtgtdDatabase } from './database'
import { DatabaseContext } from './databaseContext'

/** Injects the database so tests and stories can provide an isolated one */
export function DatabaseProvider({ db, children }: { db: TtgtdDatabase; children: ReactNode }) {
  return <DatabaseContext value={db}>{children}</DatabaseContext>
}
