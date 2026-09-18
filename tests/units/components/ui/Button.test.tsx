import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '@/components/ui/Button'
import { buttonClassName } from '@/components/ui/buttonClassName'

describe('Button', () => {
  it('renders a non-submitting button by default', () => {
    render(<Button>Démarrer</Button>)

    expect(screen.getByRole('button', { name: 'Démarrer' })).toHaveAttribute('type', 'button')
  })

  it('keeps an explicit type', () => {
    render(<Button type="submit">Enregistrer</Button>)

    expect(screen.getByRole('button', { name: 'Enregistrer' })).toHaveAttribute('type', 'submit')
  })

  it('forwards clicks and native attributes', async () => {
    const onClick = vi.fn()
    render(
      <Button onClick={onClick} aria-label="Retirer Balai">
        Retirer
      </Button>,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Retirer Balai' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not fire when disabled', async () => {
    const onClick = vi.fn()
    render(
      <Button onClick={onClick} disabled>
        Démarrer
      </Button>,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Démarrer' }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('uses the same classes as buttonClassName, plus any extra className', () => {
    render(
      <Button variant="secondary" size="lg" className="flex-1">
        Annuler
      </Button>,
    )

    expect(screen.getByRole('button', { name: 'Annuler' })).toHaveClass(
      ...buttonClassName({ variant: 'secondary', size: 'lg' }).split(' '),
      'flex-1',
    )
  })
})
