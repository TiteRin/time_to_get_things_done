import { createContext } from 'react'

export type ResolvedTheme = 'light' | 'dark'

export type ThemeContextValue = {
  resolvedTheme: ResolvedTheme
  setOverride: (theme: ResolvedTheme) => void
}

function initialResolvedTheme(): ResolvedTheme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export const ThemeContext = createContext<ThemeContextValue>({
  resolvedTheme: initialResolvedTheme(),
  setOverride: () => {},
})
