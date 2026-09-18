import { beforeEach, describe, expect, it, vi } from 'vitest'
import { loadThemeOverride, saveThemeOverride } from '@/storage/theme'

describe('theme storage', () => {
  beforeEach(() => window.localStorage.clear())

  it('restores a saved override', () => {
    saveThemeOverride('dark')
    expect(loadThemeOverride()).toBe('dark')

    saveThemeOverride('light')
    expect(loadThemeOverride()).toBe('light')
  })

  it('returns null when nothing was saved', () => {
    expect(loadThemeOverride()).toBeNull()
  })

  it('returns null when the stored value is unexpected', () => {
    window.localStorage.setItem('ttgtd.theme', 'system')
    expect(loadThemeOverride()).toBeNull()

    window.localStorage.setItem('ttgtd.theme', '{not json')
    expect(loadThemeOverride()).toBeNull()
  })

  it('removes the stored override when saving null', () => {
    saveThemeOverride('dark')
    saveThemeOverride(null)
    expect(loadThemeOverride()).toBeNull()
    expect(window.localStorage.getItem('ttgtd.theme')).toBeNull()
  })

  it('ignores storage failures on save', () => {
    vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    expect(() => saveThemeOverride('dark')).not.toThrow()
    vi.restoreAllMocks()
  })
})
