import { actualDurationMs, type TimelineEntry } from './session'

/**
 * A stretch of the session. `pause` is a task paused mid-way; `wait` is the time a task
 * spends waiting for its first tap (or to be skipped). Both are excluded from effective time.
 */
export type TimelineSegment = {
  taskIndex: number
  kind: 'work' | 'pause' | 'wait'
  /** Milliseconds since the first event of the session */
  from: number
  to: number
}

/** Cuts the timeline at every event: each gap is attributed to the task of the event closing it */
export function timelineSegments(timeline: TimelineEntry[]): TimelineSegment[] {
  const origin = timeline[0]?.at ?? 0
  const segments: TimelineSegment[] = []

  for (let i = 1; i < timeline.length; i++) {
    const previous = timeline[i - 1]
    const current = timeline[i]
    if (current.at === previous.at) continue

    const running = previous.type === 'start' || previous.type === 'resume'
    segments.push({
      taskIndex: current.taskIndex,
      kind: running ? 'work' : previous.type === 'pause' ? 'pause' : 'wait',
      from: previous.at - origin,
      to: current.at - origin,
    })
  }

  return segments
}

/** Total (pauses included) and effective (running only) time of one task; waits never count */
export function taskDurations(timeline: TimelineEntry[], taskIndex: number) {
  const totalMs = timelineSegments(timeline)
    .filter((segment) => segment.taskIndex === taskIndex && segment.kind !== 'wait')
    .reduce((sum, segment) => sum + segment.to - segment.from, 0)

  return { totalMs, effectiveMs: actualDurationMs(timeline, taskIndex) }
}

/** A task counts as done only when it was started, then completed (not interrupted by "Terminer") */
export function sessionSummary(timeline: TimelineEntry[], taskCount: number) {
  const started = new Set(timeline.filter((e) => e.type === 'start').map((e) => e.taskIndex))
  const completedCount = timeline.filter(
    (e) => e.type === 'complete' && started.has(e.taskIndex),
  ).length
  const elapsedMs = timeline.length > 0 ? timeline[timeline.length - 1].at - timeline[0].at : 0

  return { completedCount, taskCount, elapsedMs }
}

/** "45 s", "2 min 30 s", "1 h 3 min": seconds are dropped past one hour */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) return minutes ? `${hours} h ${minutes} min` : `${hours} h`
  if (minutes > 0) return seconds ? `${minutes} min ${seconds} s` : `${minutes} min`
  return `${seconds} s`
}
