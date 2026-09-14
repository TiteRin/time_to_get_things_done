import { beforeEach, describe, expect, it } from 'vitest'
import type { TtgtdDatabase } from '@/db/database'
import { createTask, listTasks, updateTask } from '@/repositories/taskRepository'
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

  describe('createTask', () => {
    it('stores a task with a generated id and a normalized name', async () => {
      const task = await createTask(db, {
        name: '  Laver   les vitres ',
        expectedDuration: 20,
        roomId: 'salon',
      })

      expect(task).toEqual({
        id: expect.stringMatching(/^[0-9a-f-]{36}$/),
        name: 'Laver les vitres',
        expectedDuration: 20,
        roomId: 'salon',
      })
      expect(await db.tasks.get(task.id)).toEqual(task)
    })

    it('generates a distinct id for each task, even with the same name', async () => {
      const first = await createTask(db, { name: 'Passer le balai' })
      const second = await createTask(db, { name: 'Passer le balai' })

      expect(first.id).not.toBe(second.id)
      expect(await db.tasks.count()).toBe(2)
    })

    it('refuses an empty name and stores nothing', async () => {
      await expect(createTask(db, { name: '  ' })).rejects.toThrow(
        'Le nom de la tâche est obligatoire',
      )
      expect(await db.tasks.count()).toBe(0)
    })
  })

  describe('updateTask', () => {
    it('replaces the task, so cleared fields are removed', async () => {
      await db.tasks.add({
        id: 't1',
        name: 'Faire la vaisselle',
        expectedDuration: 15,
        perceivedDifficulty: 'medium',
        roomId: 'cuisine',
      })

      const updated = await updateTask(db, {
        id: 't1',
        name: ' Faire la  vaisselle ',
        expectedDuration: 10,
      })

      expect(updated).toEqual({ id: 't1', name: 'Faire la vaisselle', expectedDuration: 10 })
      expect(await db.tasks.get('t1')).toEqual(updated)
    })

    it('refuses an empty name and keeps the stored task', async () => {
      await db.tasks.add({ id: 't1', name: 'Faire la vaisselle' })

      await expect(updateTask(db, { id: 't1', name: '' })).rejects.toThrow(
        'Le nom de la tâche est obligatoire',
      )
      expect(await db.tasks.get('t1')).toEqual({ id: 't1', name: 'Faire la vaisselle' })
    })

    it('refuses to update a task that does not exist', async () => {
      await expect(updateTask(db, { id: 'missing', name: 'Aspirer' })).rejects.toThrow(
        'Tâche introuvable',
      )
      expect(await db.tasks.count()).toBe(0)
    })
  })
})
