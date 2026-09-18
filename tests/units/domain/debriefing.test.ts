import { describe, expect, it } from 'vitest'
import {
  formatDuration,
  formatOffset,
  sessionSummary,
  taskDurations,
  timelineBlocks,
  timelineSegments,
} from '@/domain/debriefing'
import type { TimelineEntry } from '@/domain/session'

const entry = (type: TimelineEntry['type'], taskIndex: number, at: number): TimelineEntry => ({
  type,
  taskIndex,
  at,
})

// Task 0: worked 60s, paused 30s, worked 120s. Task 1: waited 10s, never started.
// Task 2: waited 5s, worked 60s, ended through "Terminer".
const timeline: TimelineEntry[] = [
  entry('start', 0, 1000),
  entry('pause', 0, 61_000),
  entry('resume', 0, 91_000),
  entry('complete', 0, 211_000),
  entry('complete', 1, 221_000),
  entry('start', 2, 226_000),
  entry('finish', 2, 286_000),
]

describe('timelineSegments', () => {
  it('is empty without any event', () => {
    expect(timelineSegments([])).toEqual([])
  })

  it('splits the timeline into work, pause and wait segments relative to the first event', () => {
    expect(timelineSegments(timeline)).toEqual([
      { taskIndex: 0, kind: 'work', from: 0, to: 60_000 },
      { taskIndex: 0, kind: 'pause', from: 60_000, to: 90_000 },
      { taskIndex: 0, kind: 'work', from: 90_000, to: 210_000 },
      { taskIndex: 1, kind: 'wait', from: 210_000, to: 220_000 },
      { taskIndex: 2, kind: 'wait', from: 220_000, to: 225_000 },
      { taskIndex: 2, kind: 'work', from: 225_000, to: 285_000 },
    ])
  })

  it('treats a pause ended by "Terminer" as a pause', () => {
    expect(
      timelineSegments([entry('start', 0, 0), entry('pause', 0, 10), entry('finish', 0, 30)]),
    ).toEqual([
      { taskIndex: 0, kind: 'work', from: 0, to: 10 },
      { taskIndex: 0, kind: 'pause', from: 10, to: 30 },
    ])
  })

  it('skips zero-length segments', () => {
    expect(timelineSegments([entry('start', 0, 5), entry('complete', 0, 5)])).toEqual([])
  })

  it('has no segment when the only event is a completion', () => {
    expect(timelineSegments([entry('complete', 0, 5)])).toEqual([])
  })
})

describe('timelineBlocks', () => {
  it('is empty without any event', () => {
    expect(timelineBlocks([])).toEqual([])
  })

  it('merges a task and its pauses into one block, waits staying apart', () => {
    expect(timelineBlocks(timeline)).toEqual([
      {
        kind: 'task',
        taskIndex: 0,
        from: 0,
        to: 210_000,
        pauses: [{ from: 60_000, to: 90_000 }],
      },
      { kind: 'wait', taskIndex: 1, from: 210_000, to: 220_000, pauses: [] },
      { kind: 'wait', taskIndex: 2, from: 220_000, to: 225_000, pauses: [] },
      { kind: 'task', taskIndex: 2, from: 225_000, to: 285_000, pauses: [] },
    ])
  })

  it('keeps a task interrupted while paused as a task block ending on the pause', () => {
    expect(
      timelineBlocks([entry('start', 0, 0), entry('pause', 0, 10), entry('finish', 0, 30)]),
    ).toEqual([{ kind: 'task', taskIndex: 0, from: 0, to: 30, pauses: [{ from: 10, to: 30 }] }])
  })
})

describe('formatOffset', () => {
  it('reads as a delay since the start of the session', () => {
    expect(formatOffset(0)).toBe('T0')
    expect(formatOffset(45_000)).toBe('+45 s')
    expect(formatOffset(150_000)).toBe('+3 min')
    expect(formatOffset(3_600_000)).toBe('+1 h')
  })
})

describe('taskDurations', () => {
  it('counts pauses in the total but not in the effective duration', () => {
    expect(taskDurations(timeline, 0)).toEqual({ totalMs: 210_000, effectiveMs: 180_000 })
  })

  it('never counts the wait before a task starts', () => {
    expect(taskDurations(timeline, 2)).toEqual({ totalMs: 60_000, effectiveMs: 60_000 })
    expect(taskDurations(timeline, 1)).toEqual({ totalMs: 0, effectiveMs: 0 })
  })
})

describe('sessionSummary', () => {
  it('counts only started then completed tasks, and the elapsed time', () => {
    expect(sessionSummary(timeline, 3)).toEqual({
      completedCount: 1,
      taskCount: 3,
      elapsedMs: 285_000,
    })
  })

  it('is zero for an empty session', () => {
    expect(sessionSummary([], 2)).toEqual({ completedCount: 0, taskCount: 2, elapsedMs: 0 })
  })
})

describe('formatDuration', () => {
  it.each([
    [0, '0 s'],
    [45_400, '45 s'],
    [60_000, '1 min'],
    [150_000, '2 min 30 s'],
    [3_600_000, '1 h'],
    [3_780_000, '1 h 3 min'],
  ])('formats %i ms as %s', (ms, expected) => {
    expect(formatDuration(ms)).toBe(expected)
  })
})
