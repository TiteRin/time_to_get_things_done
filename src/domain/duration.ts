/** Minutes to store as expectedDuration; rounds up, floored at 1 once something was timed */
export function minutesFromMs(ms: number): number {
  if (ms <= 0) return 0
  return Math.max(1, Math.ceil(ms / 60_000))
}

/** Formats a duration as mm:ss, for a timeline dump */
export function formatElapsedTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

/** Formats a duration as mm:ss:cc (hundredths), for a live, dynamic-looking chrono */
export function formatChronoTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const hundredths = Math.floor((ms % 1000) / 10)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(hundredths).padStart(2, '0')}`
}
