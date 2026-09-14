import { beforeEach, describe, expect, it } from 'vitest'
import type { TtgtdDatabase } from '@/db/database'
import { listTasks } from '@/repositories/taskRepository'
import { setupTestDatabases } from '../../helpers/testDatabase'

const openDatabase = setupTestDatabases()
let db: TtgtdDatabase

beforeEach(async () => {
  db = openDatabase()
  await db.tasks.clear()
})

describe('taskRepository', () => {
  describe('listTasks', () => {
    it('lists tasks sorted by name, accents included', async () => {
      await db.tasks.bulkAdd([
        { id: '1', name: 'Vider le frigo' },
        { id: '2', name: 'Écrire la liste' },
        { id: '3', name: 'aspirer' },
        { id: '4', name: 'Faire le lit' },
      ])

      const names = (await listTasks(db)).map((task) => task.name)

      expect(names).toEqual(['aspirer', 'Écrire la liste', 'Faire le lit', 'Vider le frigo'])
    })
  })
})
