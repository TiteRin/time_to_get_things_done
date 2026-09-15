import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Room } from '@/domain/room'
import type { Task } from '@/domain/task'
import { TaskList } from '@/components/TaskList'

const rooms: Room[] = [
  { id: 'salon', name: 'Salon' },
  { id: 'cuisine', name: 'Cuisine' },
]

const tasks: Task[] = [
  { id: 't1', name: 'Épousseter', roomId: 'salon' },
  { id: 't2', name: 'Aspirer' },
  { id: 't3', name: 'Passer le balai', roomId: 'cuisine' },
  { id: 't4', name: 'Balayer', roomId: 'salon' },
]

describe('TaskList', () => {
  it('groups the tasks by room, rooms sorted by name, roomless tasks last', () => {
    render(<TaskList tasks={tasks} rooms={rooms} />)

    const headings = screen.getAllByRole('heading')
    expect(headings.map((heading) => heading.textContent)).toEqual([
      'Cuisine',
      'Salon',
      'Aucune pièce',
    ])
  })

  it('sorts the tasks by name inside each group, ignoring accents', () => {
    render(<TaskList tasks={tasks} rooms={rooms} />)

    const salon = screen.getByRole('heading', { name: 'Salon' }).closest('section')!
    const items = within(salon).getAllByRole('listitem')
    expect(items.map((item) => item.textContent)).toEqual(['Balayer', 'Épousseter'])
  })

  it('leaves out rooms without any task', () => {
    render(<TaskList tasks={[{ id: 't1', name: 'Épousseter', roomId: 'salon' }]} rooms={rooms} />)

    expect(screen.queryByRole('heading', { name: 'Cuisine' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Aucune pièce' })).not.toBeInTheDocument()
  })

  it('reports the tapped task', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<TaskList tasks={tasks} rooms={rooms} onSelect={onSelect} />)

    await user.click(screen.getByRole('button', { name: 'Épousseter' }))

    expect(onSelect).toHaveBeenCalledWith(tasks[0])
  })
})
