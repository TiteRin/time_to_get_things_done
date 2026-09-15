import { beforeEach, describe, expect, it, vi } from 'vitest'
import { loadLastList, saveLastList } from '@/storage/lastList'

describe('lastList storage', () => {
  beforeEach(() => window.localStorage.clear())

  it('restores the saved ids in order', () => {
    saveLastList(['b', 'a', 'c'])
    expect(loadLastList()).toEqual(['b', 'a', 'c'])
  })

  it('returns an empty list when nothing was saved', () => {
    expect(loadLastList()).toEqual([])
  })

  it('returns an empty list when the stored value is unreadable', () => {
    window.localStorage.setItem('ttgtd.lastList', '{not json')
    expect(loadLastList()).toEqual([])

    window.localStorage.setItem('ttgtd.lastList', '{"foo": 1}')
    expect(loadLastList()).toEqual([])
  })

  it('drops duplicated and non-string ids', () => {
    window.localStorage.setItem('ttgtd.lastList', '["a", 3, "b", "a"]')
    expect(loadLastList()).toEqual(['a', 'b'])
  })

  it('ignores storage failures on save', () => {
    vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    expect(() => saveLastList(['a'])).not.toThrow()
    vi.restoreAllMocks()
  })
})
