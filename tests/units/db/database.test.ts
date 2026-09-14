import { afterEach, describe, expect, it } from 'vitest'
import { defaultRooms, defaultTasks } from '@/catalog/defaultCatalog'
import { TtgtdDatabase } from '@/db/database'

const opened: TtgtdDatabase[] = []

function openDatabase(name: string) {
  const db = new TtgtdDatabase(name)
  opened.push(db)
  return db
}

afterEach(async () => {
  await Promise.all(opened.splice(0).map((db) => db.delete()))
})

describe('TtgtdDatabase', () => {
  it('copies the default catalogue on first launch', async () => {
    const db = openDatabase(crypto.randomUUID())

    expect(await db.rooms.toArray()).toEqual(expect.arrayContaining(defaultRooms))
    expect(await db.rooms.count()).toBe(defaultRooms.length)
    expect(await db.tasks.toArray()).toEqual(expect.arrayContaining(defaultTasks))
    expect(await db.tasks.count()).toBe(defaultTasks.length)
    expect(await db.equipment.count()).toBe(0)
  })

  it('never copies the catalogue again once the user owns their data', async () => {
    const name = crypto.randomUUID()
    const first = new TtgtdDatabase(name)
    await first.tasks.clear()
    first.close()

    const second = openDatabase(name)

    expect(await second.tasks.count()).toBe(0)
  })
})
