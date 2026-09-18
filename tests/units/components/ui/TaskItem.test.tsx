import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TaskItem } from '@/components/ui/TaskItem'

describe('TaskItem', () => {
  it('shows the name and the details', () => {
    render(<TaskItem name="Faire la vaisselle" details="Cuisine" />)

    expect(screen.getByText('Faire la vaisselle')).toBeInTheDocument()
    expect(screen.getByText('Cuisine')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('becomes a single button when tappable, named by its label or else its content', async () => {
    const onClick = vi.fn()
    const { rerender } = render(<TaskItem name="Faire la vaisselle" onClick={onClick} />)

    await userEvent.click(screen.getByRole('button', { name: 'Faire la vaisselle' }))
    expect(onClick).toHaveBeenCalledOnce()

    rerender(
      <TaskItem
        name="Faire la vaisselle"
        onClick={onClick}
        ariaLabel="Chronométrer Faire la vaisselle"
      />,
    )
    expect(
      screen.getByRole('button', { name: 'Chronométrer Faire la vaisselle' }),
    ).toBeInTheDocument()
  })

  it('exposes the details id so an action can be described by them', () => {
    render(
      <TaskItem
        name="Faire la vaisselle"
        details="Durée : 15 min"
        detailsId="details-vaisselle"
        trailing={
          <button type="button" aria-describedby="details-vaisselle">
            Sélectionner
          </button>
        }
      />,
    )

    expect(screen.getByRole('button', { name: 'Sélectionner' })).toHaveAccessibleDescription(
      'Durée : 15 min',
    )
  })

  it('renders leading and trailing controls around the text', () => {
    render(
      <TaskItem
        name="Faire la vaisselle"
        leading={<button type="button">Déplacer</button>}
        trailing={<button type="button">Retirer</button>}
      />,
    )

    expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual([
      'Déplacer',
      'Retirer',
    ])
  })
})
