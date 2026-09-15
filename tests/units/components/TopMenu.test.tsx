import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TopMenu } from '@/components/TopMenu'

describe('TopMenu', () => {
  it('offers to cancel or finish the session', async () => {
    const onCancel = vi.fn()
    const onFinish = vi.fn()
    render(<TopMenu onCancel={onCancel} onFinish={onFinish} />)

    expect(screen.getByRole('dialog', { name: 'Menu de la session' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Annuler' }))
    expect(onCancel).toHaveBeenCalledOnce()

    await userEvent.click(screen.getByRole('button', { name: 'Terminer' }))
    expect(onFinish).toHaveBeenCalledOnce()
  })

  it('renders extra actions inside the menu', () => {
    render(
      <TopMenu onCancel={vi.fn()} onFinish={vi.fn()}>
        <a href="/configuration">Configuration</a>
      </TopMenu>,
    )

    const menu = screen.getByRole('dialog', { name: 'Menu de la session' })
    expect(within(menu).getByRole('link', { name: 'Configuration' })).toBeInTheDocument()
  })
})
