const KEY = 'ttgtd.theme'

export type ThemeOverride = 'light' | 'dark' | null

/** Saves the manual theme override; passing null clears it (follow system). Storage failures are ignored */
export function saveThemeOverride(theme: ThemeOverride) {
  try {
    if (theme === null) {
      window.localStorage.removeItem(KEY)
    } else {
      window.localStorage.setItem(KEY, theme)
    }
  } catch {
    // Quota exceeded or private browsing: the app still works, it just won't remember the choice
  }
}

/** The manual theme override; null when absent or unreadable (follow system) */
export function loadThemeOverride(): ThemeOverride {
  try {
    const value = window.localStorage.getItem(KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}
