import type { SessionStatus } from '@/domain/session'

const HINT = {
  idle: 'Touchez pour commencer',
  running: 'En cours',
  paused: 'En pause',
} as const

export type StatusHintProps = {
  /** Current timer state. */
  status: Exclude<SessionStatus, 'ended'>
}

/**
 * One-line reminder of the timer state, with a pulsing dot while it runs. Designed to sit
 * over a `TapToggle`: it paints above it and lets taps through.
 */
export function StatusHint({ status }: StatusHintProps) {
  return (
    <p className="pointer-events-none relative flex items-center gap-2 text-muted-foreground">
      {status === 'running' && (
        <span aria-hidden="true" className="size-2 animate-pulse rounded-full bg-accent-secondary" />
      )}
      {HINT[status]}
    </p>
  )
}
