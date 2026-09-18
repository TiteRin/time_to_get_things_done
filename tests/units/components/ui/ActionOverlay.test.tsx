import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ActionOverlay } from '@/components/ui/ActionOverlay'

describe('ActionOverlay', () => {
  it('is a labelled modal dialog', () => {
    render(<ActionOverlay label="Confirmer l'abandon" actions={[]} />)

    expect(screen.getByRole('dialog', { name: "Confirmer l'abandon" })).toHaveAttribute(
      'aria-modal',
      'true',
    )
  })

  it('shows the message, then the actions in the given order', async () => {
    const onAbandon = vi.fn()
    const onContinue = vi.fn()
    render(
      <ActionOverlay
        label="Confirmer l'abandon"
        message="Abandonner ce chronométrage ?"
        actions={[
          { label: 'Abandonner', variant: 'secondary', onClick: onAbandon },
          { label: 'Continuer', onClick: onContinue },
        ]}
      />,
    )

    expect(screen.getByText('Abandonner ce chronométrage ?')).toBeInTheDocument()
    expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual([
      'Abandonner',
      'Continuer',
    ])
    await userEvent.click(screen.getByRole('button', { name: 'Continuer' }))
    expect(onContinue).toHaveBeenCalledOnce()
    expect(onAbandon).not.toHaveBeenCalled()
  })

  it('renders the corner slot and extra content', () => {
    render(
      <ActionOverlay
        label="Menu de la session"
        actions={[{ label: 'Terminer', onClick: vi.fn() }]}
        corner={<button type="button">Coin</button>}
      >
        <a href="/configuration">Configuration</a>
      </ActionOverlay>,
    )

    expect(screen.getByRole('button', { name: 'Coin' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Configuration' })).toBeInTheDocument()
  })
})
