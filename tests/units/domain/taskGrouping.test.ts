import { describe, expect, it } from 'vitest'
import type { Task } from '@/domain/task'
import { groupTasksByRoom } from '@/domain/taskGrouping'

const rooms = [
  { id: 'salon', name: 'Salon' },
  { id: 'cuisine', name: 'Cuisine' },
]

const tasks: Task[] = [
  { id: 't1', name: 'Épousseter', roomId: 'salon' },
  { id: 't2', name: 'Aspirer' },
  { id: 't3', name: 'Passer le balai', roomId: 'cuisine' },
  { id: 't4', name: 'Balayer', roomId: 'salon' },
]

describe('groupTasksByRoom', () => {
  it('groups by room sorted by name, roomless tasks last', () => {
    expect(groupTasksByRoom(tasks, rooms).map((group) => group.name)).toEqual([
      'Cuisine',
      'Salon',
      'Aucune pièce',
    ])
  })

  it('sorts the tasks by name inside each group, ignoring accents', () => {
    const salon = groupTasksByRoom(tasks, rooms).find((group) => group.name === 'Salon')!
    expect(salon.tasks.map((task) => task.name)).toEqual(['Balayer', 'Épousseter'])
  })

  it('leaves out rooms without any task', () => {
    const groups = groupTasksByRoom([tasks[0]], rooms)
    expect(groups.map((group) => group.name)).toEqual(['Salon'])
  })

  it('puts tasks referencing an unknown room under "Aucune pièce"', () => {
    const groups = groupTasksByRoom([{ id: 't5', name: 'Trier', roomId: 'disparue' }], rooms)
    expect(groups).toEqual([{ id: undefined, name: 'Aucune pièce', tasks: [expect.anything()] }])
  })
})
