import { use } from 'react'
import { ThemeContext, type ThemeContextValue } from '@/app/themeContext'

export function useTheme(): ThemeContextValue {
  return use(ThemeContext)
}
