import type { ComponentPropsWithoutRef } from 'react'

export type ChipProps = {
  /** Whether this option is the current choice; exposed to assistive tech as `aria-pressed`. */
  selected: boolean
} & Omit<ComponentPropsWithoutRef<'button'>, 'type' | 'aria-pressed'>

/**
 * A pill-shaped toggle for picking one option among a few (difficulty, duration presets).
 * Wrap several in a `role="group"` with an `aria-label`; the picker owns the selection logic.
 */
export function Chip({ selected, className, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`rounded-full border px-4 py-2 text-sm font-medium ${
        selected
          ? 'border-accent bg-accent text-accent-foreground'
          : 'border-border text-foreground active:bg-surface'
      }${className ? ` ${className}` : ''}`}
      {...props}
    />
  )
}
