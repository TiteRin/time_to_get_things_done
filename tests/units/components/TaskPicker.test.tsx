import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Task } from '@/domain/task'
import { TaskPicker } from '@/components/TaskPicker'

const tasks: Task[] = [
  { id: 'a', name: 'Faire la vaisselle', roomId: 'cuisine' },
  { id: 'b', name: 'Faire les litières' },
  { id: 'c', name: 'Ranger le salon', roomId: 'salon' },
]

const rooms = [
  { id: 'salon', name: 'Salon' },
  { id: 'cuisine', name: 'Cuisine' },
]

describe('TaskPicker', () => {
  it('groups tasks by room and selects the one tapped', async () => {
    const onSelect = vi.fn()
    render(<TaskPicker tasks={tasks} rooms={rooms} onSelect={onSelect} />)

    expect(screen.getByRole('heading', { name: 'Cuisine' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Aucune pièce' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Chronométrer Faire la vaisselle' }))
    expect(onSelect).toHaveBeenCalledExactlyOnceWith('a')
  })

  it('renders extra navigation', () => {
    render(
      <TaskPicker
        tasks={tasks}
        rooms={rooms}
        onSelect={vi.fn()}
        footerExtra={<a href="/">Annuler</a>}
      />,
    )

    expect(screen.getByRole('link', { name: 'Annuler' })).toBeInTheDocument()
  })
})
