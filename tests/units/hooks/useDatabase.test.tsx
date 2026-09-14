import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { DatabaseProvider } from '@/db/DatabaseProvider'
import { useDatabase } from '@/hooks/useDatabase'
import { setupTestDatabases } from '../../helpers/testDatabase'

const openDatabase = setupTestDatabases()

describe('useDatabase', () => {
  it('returns the database given to the provider', () => {
    const db = openDatabase()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <DatabaseProvider db={db}>{children}</DatabaseProvider>
    )

    const { result } = renderHook(() => useDatabase(), { wrapper })

    expect(result.current).toBe(db)
  })

  it('fails loudly when used outside of a provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => renderHook(() => useDatabase())).toThrow(
      'useDatabase must be used inside a DatabaseProvider',
    )
  })
})
