import type { ComponentPropsWithoutRef } from 'react'

export type ButtonVariant = 'primary' | 'secondary'
export type ButtonSize = 'sm' | 'md' | 'lg'

const VARIANT: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-accent-foreground active:bg-accent/85',
  secondary: 'border border-border text-foreground active:bg-surface',
}

const SIZE: Record<ButtonSize, string> = {
  sm: 'rounded-lg px-3 py-1.5 text-sm font-medium',
  md: 'rounded-xl px-4 py-3 font-medium',
  lg: 'rounded-2xl px-6 py-4 text-lg font-semibold',
}

/** Exposed for elements that must match a button's box without being one (layout placeholders) */
export function buttonClassName({
  variant = 'primary',
  size = 'md',
}: { variant?: ButtonVariant; size?: ButtonSize } = {}): string {
  return `${SIZE[size]} ${VARIANT[variant]} disabled:opacity-40`
}

export function Button({
  variant,
  size,
  type = 'button',
  className,
  ...props
}: {
  variant?: ButtonVariant
  size?: ButtonSize
} & ComponentPropsWithoutRef<'button'>) {
  const base = buttonClassName({ variant, size })
  return (
    <button type={type} className={className ? `${base} ${className}` : base} {...props} />
  )
}
