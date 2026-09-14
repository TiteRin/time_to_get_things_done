import { beforeEach, describe, expect, it } from 'vitest'
import type { TtgtdDatabase } from '@/db/database'
import { findOrCreateRoom, listRooms } from '@/repositories/roomRepository'
import { setupTestDatabases } from '../../helpers/testDatabase'

const openDatabase = setupTestDatabases()
let db: TtgtdDatabase

beforeEach(async () => {
  db = openDatabase()
  await db.rooms.clear()
})

describe('roomRepository', () => {
  it('lists rooms sorted by name', async () => {
    await db.rooms.bulkAdd([
      { id: '1', name: 'Salon' },
      { id: '2', name: 'Bureau' },
      { id: '3', name: 'Entrée' },
    ])

    expect((await listRooms(db)).map((room) => room.name)).toEqual(['Bureau', 'Entrée', 'Salon'])
  })

  it('creates a room with a generated id and a normalized name', async () => {
    const room = await findOrCreateRoom(db, '  Bureau ')

    expect(room).toEqual({ id: expect.stringMatching(/^[0-9a-f-]{36}$/), name: 'Bureau' })
    expect(await db.rooms.get(room.id)).toEqual(room)
  })

  it('reuses an existing room with the same name, ignoring case and accents', async () => {
    await db.rooms.add({ id: 'salle-de-bain', name: 'Salle de bain' })

    const room = await findOrCreateRoom(db, 'SALLE DE BAÏN')

    expect(room).toEqual({ id: 'salle-de-bain', name: 'Salle de bain' })
    expect(await db.rooms.count()).toBe(1)
  })

  it('refuses an empty name', async () => {
    await expect(findOrCreateRoom(db, ' ')).rejects.toThrow('Le nom de la pièce est obligatoire')
    expect(await db.rooms.count()).toBe(0)
  })
})
