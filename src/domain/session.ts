import type { Task } from './task'

export type SessionStatus = 'idle' | 'running' | 'paused' | 'ended'

export type TimelineEntry = {
  type: 'start' | 'pause' | 'resume' | 'complete' | 'finish'
  taskIndex: number
  at: number
}

export type SessionState = {
  tasks: Task[]
  currentIndex: number
  status: SessionStatus
  menuOpen: boolean
  timeline: TimelineEntry[]
}

/** Timestamps are injected so the reducer stays pure and deterministic */
export type SessionEvent =
  | { type: 'START' | 'PAUSE' | 'RESUME' | 'NEXT' | 'FINISH'; at: number }
  | { type: 'OPEN_MENU' | 'CLOSE_MENU' | 'RESTART' }

export function createSession(tasks: Task[]): SessionState {
  return {
    tasks,
    currentIndex: 0,
    status: tasks.length === 0 ? 'ended' : 'idle',
    menuOpen: false,
    timeline: [],
  }
}

function record(state: SessionState, type: TimelineEntry['type'], at: number): TimelineEntry[] {
  return [...state.timeline, { type, taskIndex: state.currentIndex, at }]
}

export function sessionReducer(state: SessionState, event: SessionEvent): SessionState {
  // The only way out of an ended session: run the same list again, from scratch
  if (event.type === 'RESTART') return createSession(state.tasks)
  if (state.status === 'ended') return state

  switch (event.type) {
    case 'START':
      if (state.status !== 'idle') return state
      return { ...state, status: 'running', timeline: record(state, 'start', event.at) }

    case 'PAUSE':
      if (state.status !== 'running') return state
      return { ...state, status: 'paused', timeline: record(state, 'pause', event.at) }

    case 'RESUME':
      if (state.status !== 'paused') return state
      return { ...state, status: 'running', timeline: record(state, 'resume', event.at) }

    case 'NEXT': {
      const timeline = record(state, 'complete', event.at)
      const isLast = state.currentIndex === state.tasks.length - 1
      if (isLast) return { ...state, status: 'ended', menuOpen: false, timeline }
      return { ...state, currentIndex: state.currentIndex + 1, status: 'idle', timeline }
    }

    case 'FINISH':
      return {
        ...state,
        status: 'ended',
        menuOpen: false,
        timeline: record(state, 'finish', event.at),
      }

    case 'OPEN_MENU':
      return { ...state, menuOpen: true }

    case 'CLOSE_MENU':
      return { ...state, menuOpen: false }
  }
}

/** Time actually spent running a task: sum of start/resume → pause/complete/finish segments */
export function actualDurationMs(timeline: TimelineEntry[], taskIndex: number): number {
  let total = 0
  let runningSince: number | null = null

  for (const entry of timeline) {
    if (entry.taskIndex !== taskIndex) continue
    if (entry.type === 'start' || entry.type === 'resume') {
      runningSince = entry.at
    } else if (runningSince !== null) {
      total += entry.at - runningSince
      runningSince = null
    }
  }

  return total
}

/** Like actualDurationMs, but also counts a still-running segment up to `now` (for a live display) */
export function elapsedMs(timeline: TimelineEntry[], taskIndex: number, now: number): number {
  let total = 0
  let runningSince: number | null = null

  for (const entry of timeline) {
    if (entry.taskIndex !== taskIndex) continue
    if (entry.type === 'start' || entry.type === 'resume') {
      runningSince = entry.at
    } else if (runningSince !== null) {
      total += entry.at - runningSince
      runningSince = null
    }
  }

  if (runningSince !== null) total += now - runningSince
  return total
}

/** Wall-clock time from the first start to the last recorded event, pauses included */
export function totalDurationMs(timeline: TimelineEntry[], taskIndex: number): number {
  const entries = timeline.filter((entry) => entry.taskIndex === taskIndex)
  const start = entries.find((entry) => entry.type === 'start')
  if (!start) return 0

  return entries.at(-1)!.at - start.at
}
