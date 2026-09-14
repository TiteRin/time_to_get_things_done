import { describe, expect, it } from 'vitest'
import {
  actualDurationMs,
  createSession,
  sessionReducer,
  type SessionEvent,
} from '@/domain/session'
import type { Task } from '@/domain/task'

const tasks: Task[] = [
  { id: 'a', name: 'Faire la vaisselle', expectedDuration: 15, perceivedDifficulty: 'medium' },
  { id: 'b', name: 'Faire les litières', expectedDuration: 5, perceivedDifficulty: 'easy' },
]

const run = (events: SessionEvent[], initial = createSession(tasks)) =>
  events.reduce(sessionReducer, initial)

describe('createSession', () => {
  it('starts idle on the first task with an empty timeline', () => {
    const session = createSession(tasks)

    expect(session.status).toBe('idle')
    expect(session.currentIndex).toBe(0)
    expect(session.menuOpen).toBe(false)
    expect(session.timeline).toEqual([])
  })

  it('is ended right away when there is no task', () => {
    expect(createSession([]).status).toBe('ended')
  })
})

describe('sessionReducer', () => {
  describe('start / pause / resume', () => {
    it('starts the current task', () => {
      const session = run([{ type: 'START', at: 1000 }])

      expect(session.status).toBe('running')
      expect(session.timeline).toEqual([{ type: 'start', taskIndex: 0, at: 1000 }])
    })

    it('pauses a running task', () => {
      const session = run([
        { type: 'START', at: 1000 },
        { type: 'PAUSE', at: 2000 },
      ])

      expect(session.status).toBe('paused')
      expect(session.timeline.at(-1)).toEqual({ type: 'pause', taskIndex: 0, at: 2000 })
    })

    it('resumes a paused task', () => {
      const session = run([
        { type: 'START', at: 1000 },
        { type: 'PAUSE', at: 2000 },
        { type: 'RESUME', at: 3000 },
      ])

      expect(session.status).toBe('running')
      expect(session.timeline.at(-1)).toEqual({ type: 'resume', taskIndex: 0, at: 3000 })
    })

    it.each<[string, SessionEvent[]]>([
      ['PAUSE while idle', [{ type: 'PAUSE', at: 1 }]],
      ['RESUME while idle', [{ type: 'RESUME', at: 1 }]],
      [
        'START while running',
        [
          { type: 'START', at: 1 },
          { type: 'START', at: 2 },
        ],
      ],
      [
        'RESUME while running',
        [
          { type: 'START', at: 1 },
          { type: 'RESUME', at: 2 },
        ],
      ],
    ])('ignores %s', (_, events) => {
      const before = run(events.slice(0, -1))
      expect(sessionReducer(before, events.at(-1)!)).toBe(before)
    })
  })

  describe('next', () => {
    it('completes the current task and moves to the next one, waiting for a tap', () => {
      const session = run([
        { type: 'START', at: 1000 },
        { type: 'NEXT', at: 5000 },
      ])

      expect(session.currentIndex).toBe(1)
      expect(session.status).toBe('idle')
      expect(session.timeline.at(-1)).toEqual({ type: 'complete', taskIndex: 0, at: 5000 })
    })

    it('completes a task even if it was never started', () => {
      const session = run([{ type: 'NEXT', at: 5000 }])

      expect(session.currentIndex).toBe(1)
      expect(session.timeline).toEqual([{ type: 'complete', taskIndex: 0, at: 5000 }])
    })

    it('ends the session after the last task', () => {
      const session = run([
        { type: 'NEXT', at: 1000 },
        { type: 'NEXT', at: 2000 },
      ])

      expect(session.status).toBe('ended')
      expect(session.currentIndex).toBe(1)
      expect(session.timeline.at(-1)).toEqual({ type: 'complete', taskIndex: 1, at: 2000 })
    })
  })

  describe('menu', () => {
    it('opens and closes the menu without touching the timer', () => {
      const opened = run([{ type: 'START', at: 1000 }, { type: 'OPEN_MENU' }])
      expect(opened.menuOpen).toBe(true)
      expect(opened.status).toBe('running')

      const closed = sessionReducer(opened, { type: 'CLOSE_MENU' })
      expect(closed.menuOpen).toBe(false)
      expect(closed.status).toBe('running')
      expect(closed.timeline).toEqual(opened.timeline)
    })

    it('finishes the session and closes the menu', () => {
      const session = run([
        { type: 'START', at: 1000 },
        { type: 'OPEN_MENU' },
        { type: 'FINISH', at: 4000 },
      ])

      expect(session.status).toBe('ended')
      expect(session.menuOpen).toBe(false)
      expect(session.timeline.at(-1)).toEqual({ type: 'finish', taskIndex: 0, at: 4000 })
    })
  })

  it('ignores every event once ended', () => {
    const ended = run([{ type: 'FINISH', at: 1000 }])

    const events: SessionEvent[] = [
      { type: 'START', at: 2000 },
      { type: 'PAUSE', at: 2000 },
      { type: 'RESUME', at: 2000 },
      { type: 'NEXT', at: 2000 },
      { type: 'OPEN_MENU' },
      { type: 'CLOSE_MENU' },
      { type: 'FINISH', at: 2000 },
    ]
    for (const event of events) {
      expect(sessionReducer(ended, event)).toBe(ended)
    }
  })
})

describe('actualDurationMs', () => {
  it('is 0 for a task that was never started', () => {
    const session = run([{ type: 'NEXT', at: 5000 }])
    expect(actualDurationMs(session.timeline, 0)).toBe(0)
  })

  it('sums running segments, excluding pauses', () => {
    const session = run([
      { type: 'START', at: 1000 },
      { type: 'PAUSE', at: 3000 }, // 2s
      { type: 'RESUME', at: 10_000 },
      { type: 'NEXT', at: 15_000 }, // 5s
      { type: 'START', at: 20_000 },
      { type: 'FINISH', at: 21_000 }, // 1s on task 1
    ])

    expect(actualDurationMs(session.timeline, 0)).toBe(7000)
    expect(actualDurationMs(session.timeline, 1)).toBe(1000)
  })

  it('does not count time while paused when the task is completed', () => {
    const session = run([
      { type: 'START', at: 1000 },
      { type: 'PAUSE', at: 2000 },
      { type: 'NEXT', at: 9000 },
    ])

    expect(actualDurationMs(session.timeline, 0)).toBe(1000)
  })
})
