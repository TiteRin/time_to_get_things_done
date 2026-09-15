import { describe, expect, it } from 'vitest'
import type { Task } from '@/domain/task'
import { reorder, toggleId, totalExpectedDuration } from '@/domain/taskSelection'

const tasks: Task[] = [
  { id: 'a', name: 'Faire la vaisselle', expectedDuration: 15 },
  { id: 'b', name: 'Faire les litières', expectedDuration: 5 },
  { id: 'c', name: 'Ranger le salon' },
]

describe('totalExpectedDuration', () => {
  it('sums the expected durations in minutes', () => {
    expect(totalExpectedDuration(tasks)).toBe(20)
  })

  it('is zero for an empty selection', () => {
    expect(totalExpectedDuration([])).toBe(0)
  })
})

describe('toggleId', () => {
  it('appends an id not yet selected', () => {
    expect(toggleId(['a'], 'b')).toEqual(['a', 'b'])
  })

  it('removes an id already selected, keeping the order', () => {
    expect(toggleId(['a', 'b', 'c'], 'b')).toEqual(['a', 'c'])
  })
})

describe('reorder', () => {
  it('moves an item forward', () => {
    expect(reorder(['a', 'b', 'c'], 0, 2)).toEqual(['b', 'c', 'a'])
  })

  it('moves an item backward', () => {
    expect(reorder(['a', 'b', 'c'], 2, 0)).toEqual(['c', 'a', 'b'])
  })

  it('returns the same array when nothing moves or an index is out of range', () => {
    const ids = ['a', 'b']
    expect(reorder(ids, 1, 1)).toBe(ids)
    expect(reorder(ids, 5, 0)).toBe(ids)
    expect(reorder(ids, 0, -1)).toBe(ids)
  })
})
