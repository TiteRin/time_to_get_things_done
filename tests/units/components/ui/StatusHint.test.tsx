import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StatusHint } from '@/components/ui/StatusHint'

describe('StatusHint', () => {
  it.each([
    ['idle', 'Touchez pour commencer'],
    ['running', 'En cours'],
    ['paused', 'En pause'],
  ] as const)('tells the user where they are when %s', (status, hint) => {
    render(<StatusHint status={status} />)

    expect(screen.getByText(hint)).toBeInTheDocument()
  })

  it('shows the live indicator only while running', () => {
    const { container, rerender } = render(<StatusHint status="running" />)
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument()

    rerender(<StatusHint status="paused" />)
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument()
  })
})
