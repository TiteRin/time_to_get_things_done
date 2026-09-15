import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useEquipment } from '@/hooks/useEquipment'
import { databaseWrapper, setupTestDatabases } from '../../helpers/testDatabase'

const openDatabase = setupTestDatabases()

describe('useEquipment', () => {
  it('starts empty and reflects newly added equipment', async () => {
    const db = openDatabase()
    const { result } = renderHook(() => useEquipment(), { wrapper: databaseWrapper(db) })

    expect(result.current.equipment).toBeUndefined()
    await waitFor(() => expect(result.current.equipment).toEqual([]))

    const created = await act(() => result.current.findOrCreateEquipment('Balai'))

    await waitFor(() => expect(result.current.equipment).toEqual([created]))
  })
})
