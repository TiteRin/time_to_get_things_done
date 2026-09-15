import { beforeEach, describe, expect, it } from 'vitest'
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
})
