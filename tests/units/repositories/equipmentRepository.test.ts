import { beforeEach, describe, expect, it } from 'vitest'
import type { TtgtdDatabase } from '@/db/database'
import { findOrCreateEquipment, listEquipment } from '@/repositories/equipmentRepository'
import { setupTestDatabases } from '../../helpers/testDatabase'

const openDatabase = setupTestDatabases()
let db: TtgtdDatabase

beforeEach(async () => {
  db = openDatabase()
})

describe('equipmentRepository', () => {
  it('lists equipment sorted by name', async () => {
    await db.equipment.bulkAdd([
      { id: '1', name: 'Serpillère' },
      { id: '2', name: 'balai' },
      { id: '3', name: 'Éponge' },
    ])

    expect((await listEquipment(db)).map((item) => item.name)).toEqual([
      'balai',
      'Éponge',
      'Serpillère',
    ])
  })

  it('creates new equipment and reuses it when the same name is typed again', async () => {
    const created = await findOrCreateEquipment(db, 'Seau ')
    const reused = await findOrCreateEquipment(db, 'seau')

    expect(created).toEqual({ id: expect.stringMatching(/^[0-9a-f-]{36}$/), name: 'Seau' })
    expect(reused).toEqual(created)
    expect(await db.equipment.count()).toBe(1)
  })

  it('refuses an empty name', async () => {
    await expect(findOrCreateEquipment(db, '')).rejects.toThrow(
      'Le nom du matériel est obligatoire',
    )
  })
})
