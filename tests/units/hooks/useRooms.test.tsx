import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { defaultRooms } from '@/catalog/defaultCatalog'
import { useRooms } from '@/hooks/useRooms'
import { databaseWrapper, setupTestDatabases } from '../../helpers/testDatabase'

const openDatabase = setupTestDatabases()

describe('useRooms', () => {
  it('lists the stored rooms and reflects newly added ones', async () => {
    const db = openDatabase()
    const { result } = renderHook(() => useRooms(), { wrapper: databaseWrapper(db) })

    expect(result.current.rooms).toBeUndefined()
    await waitFor(() => expect(result.current.rooms).toHaveLength(defaultRooms.length))

    await act(() => result.current.findOrCreateRoom('Bureau'))

    await waitFor(() => expect(result.current.rooms?.map((room) => room.name)).toContain('Bureau'))
    expect(result.current.rooms).toHaveLength(defaultRooms.length + 1)
  })
})
