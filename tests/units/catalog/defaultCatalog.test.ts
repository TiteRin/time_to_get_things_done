import { describe, expect, it } from 'vitest'
import { defaultRooms, defaultTasks } from '@/catalog/defaultCatalog'

const countByRoom = () => {
  const counts: Record<string, number> = {}
  for (const task of defaultTasks) {
    const key = task.roomId ?? 'none'
    counts[key] = (counts[key] ?? 0) + 1
  }
  return counts
}

describe('defaultCatalog', () => {
  it('ships the default rooms', () => {
    expect(defaultRooms.map((room) => room.name)).toEqual([
      'Salon',
      'Cuisine',
      'Salle de bain',
      'Toilettes',
      'Chambre',
    ])
  })

  it('has at least one task in every room', () => {
    const tasksPerRoom = countByRoom()

    for (const room of defaultRooms) {
      expect(tasksPerRoom[room.id]).toBeGreaterThan(0)
    }
  })

  it('has unique ids for rooms and tasks', () => {
    const roomIds = defaultRooms.map((room) => room.id)
    const taskIds = defaultTasks.map((task) => task.id)

    expect(new Set(roomIds).size).toBe(roomIds.length)
    expect(new Set(taskIds).size).toBe(taskIds.length)
  })

  it('only references existing rooms', () => {
    const roomIds = new Set(defaultRooms.map((room) => room.id))

    for (const task of defaultTasks) {
      if (task.roomId) expect(roomIds).toContain(task.roomId)
    }
  })

  it('only provides names and rooms, leaving the rest to the user', () => {
    for (const task of defaultTasks) {
      expect(task.name.trim()).not.toBe('')
      expect(Object.keys(task).sort()).toEqual(
        task.roomId ? ['id', 'name', 'roomId'] : ['id', 'name'],
      )
    }
  })
})
