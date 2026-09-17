import { useEffect, useState, type ReactNode } from 'react'
import { ThemeContext, type ResolvedTheme } from './themeContext'
import { loadThemeOverride, saveThemeOverride, type ThemeOverride } from '@/storage/theme'

function systemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/** Injects the resolved theme; falls back to the system preference when the user has no manual override */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [override, setOverrideState] = useState<ThemeOverride>(() => loadThemeOverride())
  const [systemDark, setSystemDark] = useState(() => systemPrefersDark())

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (event: MediaQueryListEvent) => setSystemDark(event.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const resolvedTheme: ResolvedTheme = override ?? (systemDark ? 'dark' : 'light')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
    document.documentElement.style.colorScheme = resolvedTheme
  }, [resolvedTheme])

  const setOverride = (theme: ResolvedTheme) => {
    setOverrideState(theme)
    saveThemeOverride(theme)
  }

  return <ThemeContext value={{ resolvedTheme, setOverride }}>{children}</ThemeContext>
}
