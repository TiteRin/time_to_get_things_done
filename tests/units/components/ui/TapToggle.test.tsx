import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TapToggle } from '@/components/ui/TapToggle'

describe('TapToggle', () => {
  it.each([
    ['idle', 'Démarrer'],
    ['running', 'Pause'],
    ['paused', 'Reprendre'],
  ] as const)('is labelled with what a tap does when %s', (status, label) => {
    render(<TapToggle status={status} onToggle={vi.fn()} />)

    expect(screen.getByRole('button', { name: label })).toBeInTheDocument()
  })

  it('calls onToggle when tapped', async () => {
    const onToggle = vi.fn()
    render(<TapToggle status="idle" onToggle={onToggle} />)

    await userEvent.click(screen.getByRole('button', { name: 'Démarrer' }))
    expect(onToggle).toHaveBeenCalledOnce()
  })
})
