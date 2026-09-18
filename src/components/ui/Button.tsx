import type { ComponentPropsWithoutRef } from 'react'
import { buttonClassName } from './buttonClassName'
import type { ButtonSize, ButtonVariant } from './buttonClassName'

export type ButtonProps = {
  /** `primary`: the screen's main action, filled with the accent color. `secondary`: alternatives and cancellations, outlined. */
  variant?: ButtonVariant
  /** `lg`: full-width actions on immersive screens (Exécution, Chrono, home). `md`: in-page actions and forms. `sm`: inline actions on a list row. */
  size?: ButtonSize
} & ComponentPropsWithoutRef<'button'>

/**
 * The app's only button style. Defaults to `type="button"` so it never submits a form by
 * accident; pass `type="submit"` explicitly. Extra `className` is appended (layout only,
 * e.g. `flex-1`), and every native button attribute is forwarded.
 */
export function Button({ variant, size, type = 'button', className, ...props }: ButtonProps) {
  const base = buttonClassName({ variant, size })
  return <button type={type} className={className ? `${base} ${className}` : base} {...props} />
}
