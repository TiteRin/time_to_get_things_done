import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DurationPicker } from '@/components/DurationPicker'

describe('DurationPicker', () => {
  it('offers preset durations in a labelled group', () => {
    render(<DurationPicker onChange={vi.fn()} />)

    const group = screen.getByRole('group', { name: 'Durée prévue' })
    expect(group).toBeInTheDocument()
    expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual([
      '5 min',
      '10 min',
      '15 min',
      '20 min',
      '30 min',
      '45 min',
      '1 h',
    ])
  })

  it('marks the current value as pressed', () => {
    render(<DurationPicker value={15} onChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: '15 min' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: '5 min' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('selects a duration', async () => {
    const onChange = vi.fn()
    render(<DurationPicker onChange={onChange} />)

    await userEvent.click(screen.getByRole('button', { name: '20 min' }))

    expect(onChange).toHaveBeenCalledWith(20)
  })

  it('clears the duration when tapping the selected one again', async () => {
    const onChange = vi.fn()
    render(<DurationPicker value={20} onChange={onChange} />)

    await userEvent.click(screen.getByRole('button', { name: '20 min' }))

    expect(onChange).toHaveBeenCalledWith(undefined)
  })

  it('still shows a stored duration that is not a preset', () => {
    render(<DurationPicker value={25} onChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: '25 min' })).toHaveAttribute('aria-pressed', 'true')
  })
})
