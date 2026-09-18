import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Chip } from '@/components/ui/Chip'

describe('Chip', () => {
  it('exposes its selection state as a toggle button', () => {
    const { rerender } = render(<Chip selected={false}>Facile</Chip>)

    const chip = screen.getByRole('button', { name: 'Facile' })
    expect(chip).toHaveAttribute('type', 'button')
    expect(chip).toHaveAttribute('aria-pressed', 'false')

    rerender(<Chip selected>Facile</Chip>)
    expect(chip).toHaveAttribute('aria-pressed', 'true')
  })

  it('forwards clicks', async () => {
    const onClick = vi.fn()
    render(
      <Chip selected={false} onClick={onClick}>
        10 min
      </Chip>,
    )

    await userEvent.click(screen.getByRole('button', { name: '10 min' }))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
