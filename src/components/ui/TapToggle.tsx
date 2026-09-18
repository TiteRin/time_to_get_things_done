import type { SessionStatus } from '@/domain/session'

const LABEL = { idle: 'Démarrer', running: 'Pause', paused: 'Reprendre' } as const

export type TapToggleProps = {
  /** Current timer state; sets the accessible label to what the next tap will do. */
  status: Exclude<SessionStatus, 'ended'>
  /** Start, pause or resume — the caller maps it to the right session event. */
  onToggle: () => void
}

/**
 * Invisible button covering its nearest positioned ancestor: the whole area becomes a
 * start/pause/resume tap target. Content drawn over it must be `relative` (to paint above)
 * and `pointer-events-none` (to let taps through).
 */
export function TapToggle({ status, onToggle }: TapToggleProps) {
  return (
    <button
      type="button"
      aria-label={LABEL[status]}
      onClick={onToggle}
      className="absolute inset-0 active:bg-surface/30"
    />
  )
}
