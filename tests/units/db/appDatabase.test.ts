import { describe, expect, it } from 'vitest'
import { TtgtdDatabase } from '@/db/database'
import { appDatabase } from '@/db/appDatabase'

describe('appDatabase', () => {
  it('is the real application database', () => {
    expect(appDatabase).toBeInstanceOf(TtgtdDatabase)
    expect(appDatabase.name).toBe('ttgtd')
  })
})
