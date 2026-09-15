import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DifficultyPicker } from '@/components/DifficultyPicker'

describe('DifficultyPicker', () => {
  it('offers the three difficulties in a labelled group', () => {
    render(<DifficultyPicker onChange={vi.fn()} />)

    expect(screen.getByRole('group', { name: 'Difficulté perçue' })).toBeInTheDocument()
    expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual([
      'Facile',
      'Moyen',
      'Difficile',
    ])
  })

  it('marks the current value as pressed', () => {
    render(<DifficultyPicker value="hard" onChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Difficile' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Facile' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('selects a difficulty, and clears it when tapped again', async () => {
    const onChange = vi.fn()
    const { rerender } = render(<DifficultyPicker onChange={onChange} />)

    await userEvent.click(screen.getByRole('button', { name: 'Moyen' }))
    expect(onChange).toHaveBeenLastCalledWith('medium')

    rerender(<DifficultyPicker value="medium" onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Moyen' }))
    expect(onChange).toHaveBeenLastCalledWith(undefined)
  })
})
