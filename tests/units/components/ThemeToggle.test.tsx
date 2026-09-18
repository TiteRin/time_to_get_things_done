import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ThemeContext } from '@/app/themeContext'
import { ThemeToggle } from '@/components/ThemeToggle'

describe('ThemeToggle', () => {
  it('offers to switch to dark mode when the theme is light', () => {
    render(
      <ThemeContext value={{ resolvedTheme: 'light', setOverride: vi.fn() }}>
        <ThemeToggle />
      </ThemeContext>,
    )

    expect(screen.getByRole('button', { name: 'Passer en thème sombre' })).toBeInTheDocument()
  })

  it('offers to switch to light mode when the theme is dark', () => {
    render(
      <ThemeContext value={{ resolvedTheme: 'dark', setOverride: vi.fn() }}>
        <ThemeToggle />
      </ThemeContext>,
    )

    expect(screen.getByRole('button', { name: 'Passer en thème clair' })).toBeInTheDocument()
  })

  it('calls setOverride with the opposite theme on click', async () => {
    const setOverride = vi.fn()
    render(
      <ThemeContext value={{ resolvedTheme: 'light', setOverride }}>
        <ThemeToggle />
      </ThemeContext>,
    )

    await userEvent.click(screen.getByRole('button'))
    expect(setOverride).toHaveBeenCalledWith('dark')
  })

  it('renders without a ThemeProvider wrapper', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
