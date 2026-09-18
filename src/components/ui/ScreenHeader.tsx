import { ThemeToggle } from '@/components/ThemeToggle'

const TITLE_SIZE = {
  md: 'text-xl font-semibold',
  lg: 'text-3xl font-bold',
} as const

export type ScreenHeaderProps = {
  /** Rendered as the screen's `<h1>`. */
  title: string
  /** `md`: working screens. `lg`: closing screens such as the end of a session. */
  size?: keyof typeof TITLE_SIZE
  /** Appended to the row, for spacing within the screen (e.g. `mb-6`). */
  className?: string
}

/** Top row of a regular screen: its title, and the theme toggle on the right. */
export function ScreenHeader({ title, size = 'md', className = '' }: ScreenHeaderProps) {
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <h1 className={`${TITLE_SIZE[size]} text-foreground`}>{title}</h1>
      <ThemeToggle className="shrink-0" />
    </div>
  )
}
