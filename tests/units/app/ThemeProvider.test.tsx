import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ThemeProvider } from '@/app/ThemeProvider'
import { useTheme } from '@/hooks/useTheme'
import { saveThemeOverride } from '@/storage/theme'

function createMatchMedia(initialMatches: boolean) {
  let matches = initialMatches
  const listeners = new Set<(event: { matches: boolean }) => void>()
  const mql = {
    get matches() {
      return matches
    },
    addEventListener: (_type: string, cb: (event: { matches: boolean }) => void) => listeners.add(cb),
    removeEventListener: (_type: string, cb: (event: { matches: boolean }) => void) => listeners.delete(cb),
  }
  return {
    mql,
    setMatches: (value: boolean) => {
      matches = value
      listeners.forEach((cb) => cb({ matches: value }))
    },
  }
}

function stubMatchMedia(mql: unknown) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue(mql),
  )
}

function Probe() {
  const { resolvedTheme, setOverride } = useTheme()
  return (
    <div>
      <span data-testid="theme">{resolvedTheme}</span>
      <button onClick={() => setOverride(resolvedTheme === 'dark' ? 'light' : 'dark')}>toggle</button>
    </div>
  )
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('defaults to the system preference when no override is stored', () => {
    const { mql } = createMatchMedia(true)
    stubMatchMedia(mql)

    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('uses the stored override instead of the system preference', () => {
    saveThemeOverride('light')
    const { mql } = createMatchMedia(true)
    stubMatchMedia(mql)

    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('theme')).toHaveTextContent('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('setOverride switches the theme and persists it', () => {
    const { mql } = createMatchMedia(false)
    stubMatchMedia(mql)

    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )

    fireEvent.click(screen.getByRole('button'))

    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    expect(window.localStorage.getItem('ttgtd.theme')).toBe('dark')
  })

  it('follows a system change when there is no override', () => {
    const { mql, setMatches } = createMatchMedia(false)
    stubMatchMedia(mql)

    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('theme')).toHaveTextContent('light')
    act(() => setMatches(true))
    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
  })

  it('ignores a system change once an override is set', () => {
    saveThemeOverride('light')
    const { mql, setMatches } = createMatchMedia(false)
    stubMatchMedia(mql)

    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )

    act(() => setMatches(true))
    expect(screen.getByTestId('theme')).toHaveTextContent('light')
  })
})
