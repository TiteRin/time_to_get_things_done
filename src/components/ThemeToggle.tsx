import { useTheme } from '@/hooks/useTheme'

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { resolvedTheme, setOverride } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const label = isDark ? 'Passer en thème clair' : 'Passer en thème sombre'

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => setOverride(isDark ? 'light' : 'dark')}
      className={`rounded-full p-2.5 text-foreground active:bg-surface/70 ${className}`}
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
          <circle cx="12" cy="12" r="4" />
          <path
            strokeLinecap="round"
            d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      )}
    </button>
  )
}
