import type { ReactNode } from 'react'

export type TaskItemProps = {
  name: string
  /** Secondary line under the name: room, duration, difficulty… */
  details?: ReactNode
  /** `id` of the details line, for an action's `aria-describedby`. */
  detailsId?: string
  /** Visual emphasis on the name, e.g. when the task is in the selection. Not announced: expose the state on the action (`aria-pressed`). */
  selected?: boolean
  /** Makes the name and details one tappable button. */
  onClick?: () => void
  /** Accessible name of that button when its visible text isn't explicit enough (e.g. "Chronométrer …"). */
  ariaLabel?: string
  /** Control before the text, e.g. a drag handle. */
  leading?: ReactNode
  /** Control after the text, e.g. a small `Button`. */
  trailing?: ReactNode
}

/**
 * One task row in a list: its name, an optional details line, and optional controls on
 * either side. Carries no divider or list semantics — place it in a `<li>`, usually
 * through `GroupedTaskList`.
 */
export function TaskItem({
  name,
  details,
  detailsId,
  selected = false,
  onClick,
  ariaLabel,
  leading,
  trailing,
}: TaskItemProps) {
  const text = (
    <>
      <span
        className={`block font-medium ${selected ? 'text-accent-secondary' : 'text-foreground'}`}
      >
        {name}
      </span>
      {details && (
        <span id={detailsId} className="block text-sm text-muted-foreground">
          {details}
        </span>
      )}
    </>
  )

  return (
    <div className="flex items-center gap-4">
      {leading && <div className="shrink-0">{leading}</div>}
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          aria-label={ariaLabel}
          className="min-w-0 flex-1 py-3 text-left active:bg-surface/50"
        >
          {text}
        </button>
      ) : (
        <span className="min-w-0 flex-1 py-3">{text}</span>
      )}
      {trailing && <div className="shrink-0">{trailing}</div>}
    </div>
  )
}
