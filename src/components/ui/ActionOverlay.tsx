import type { ReactNode } from 'react'
import { Button } from './Button'
import type { ButtonVariant } from './buttonClassName'

export type OverlayAction = {
  label: string
  onClick: () => void
  /** Defaults to `primary`. */
  variant?: ButtonVariant
}

const ALIGN = {
  top: 'justify-start pt-[max(1.5rem,env(safe-area-inset-top))]',
  center: 'items-center justify-center text-center',
} as const

export type ActionOverlayProps = {
  /** Accessible name of the dialog. */
  label: string
  /** Optional question shown above the actions. */
  message?: string
  /** Large stacked buttons, rendered in this order — put the safe choice where the thumb lands. */
  actions: OverlayAction[]
  /** `top`: drops down from the top of the screen, like a menu. `center`: a confirmation. */
  align?: keyof typeof ALIGN
  /** Pinned to the top-right corner, e.g. a `ThemeToggle`. */
  corner?: ReactNode
  /** Extra content below the actions, e.g. a navigation link. */
  children?: ReactNode
}

/**
 * Translucent modal covering its nearest positioned ancestor, offering a few big actions.
 * Used for the Exécution menu and the chrono abandon confirmation.
 */
export function ActionOverlay({
  label,
  message,
  actions,
  align = 'center',
  corner,
  children,
}: ActionOverlayProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className={`absolute inset-0 flex flex-col gap-4 bg-background/90 p-6 text-foreground backdrop-blur-sm ${ALIGN[align]}`}
    >
      {corner && (
        <div className="absolute top-[max(1rem,env(safe-area-inset-top))] right-4">{corner}</div>
      )}
      {message && <p className="text-lg font-medium">{message}</p>}
      <div className="flex w-full flex-col gap-3">
        {actions.map((action) => (
          <Button key={action.label} size="lg" variant={action.variant} onClick={action.onClick}>
            {action.label}
          </Button>
        ))}
      </div>
      {children && <div className="mt-2 text-center">{children}</div>}
    </div>
  )
}
