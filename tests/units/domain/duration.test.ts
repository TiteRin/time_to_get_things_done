import { describe, expect, it } from 'vitest'
import { formatChronoTime, formatElapsedTime, minutesFromMs } from '@/domain/duration'

describe('minutesFromMs', () => {
  it('is 0 when nothing was timed', () => {
    expect(minutesFromMs(0)).toBe(0)
  })

  it('rounds up to the next minute', () => {
    expect(minutesFromMs(90_000)).toBe(2)
  })

  it('never goes below 1 minute once something was timed', () => {
    expect(minutesFromMs(1)).toBe(1)
    expect(minutesFromMs(40_000)).toBe(1)
  })
})

describe('formatElapsedTime', () => {
  it('formats as mm:ss', () => {
    expect(formatElapsedTime(0)).toBe('00:00')
    expect(formatElapsedTime(65_000)).toBe('01:05')
    expect(formatElapsedTime(3_723_000)).toBe('62:03')
  })
})

describe('formatChronoTime', () => {
  it('formats as mm:ss:cc, for a live, dynamic-looking chrono', () => {
    expect(formatChronoTime(0)).toBe('00:00:00')
    expect(formatChronoTime(65_234)).toBe('01:05:23')
    expect(formatChronoTime(3_723_009)).toBe('62:03:00')
  })
})
