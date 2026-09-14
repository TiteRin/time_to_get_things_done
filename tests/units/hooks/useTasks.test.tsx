import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { defaultTasks } from '@/catalog/defaultCatalog'
import { useTasks } from '@/hooks/useTasks'
import { databaseWrapper, setupTestDatabases } from '../../helpers/testDatabase'

const openDatabase = setupTestDatabases()

function setup() {
  const db = openDatabase()
  const hook = renderHook(() => useTasks(), { wrapper: databaseWrapper(db) })
  return { db, hook }
}

describe('useTasks', () => {
  it('is undefined while loading, then lists the stored tasks', async () => {
    const { hook } = setup()

    expect(hook.result.current.tasks).toBeUndefined()
    await waitFor(() => expect(hook.result.current.tasks).toHaveLength(defaultTasks.length))
  })

  it('reflects created, updated and deleted tasks', async () => {
    const { db, hook } = setup()
    await db.tasks.clear()
    await waitFor(() => expect(hook.result.current.tasks).toEqual([]))

    let id = ''
    await act(async () => {
      id = (await hook.result.current.createTask({ name: 'Laver les vitres' })).id
    })
    await waitFor(() =>
      expect(hook.result.current.tasks).toEqual([{ id, name: 'Laver les vitres' }]),
    )

    await act(() => hook.result.current.updateTask({ id, name: 'Laver les fenêtres' }))
    await waitFor(() =>
      expect(hook.result.current.tasks).toEqual([{ id, name: 'Laver les fenêtres' }]),
    )

    await act(() => hook.result.current.deleteTask(id))
    await waitFor(() => expect(hook.result.current.tasks).toEqual([]))
  })
})
