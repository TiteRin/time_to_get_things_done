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
]

describe('TaskList', () => {
  it('lists the tasks sorted by name, ignoring accents', () => {
    render(<TaskList tasks={tasks} rooms={rooms} />)

    const items = screen.getAllByRole('listitem')
    expect(items.map((item) => item.querySelector('span')?.textContent)).toEqual([
      'Aspirer',
      'Épousseter',
      'Passer le balai',
    ])
  })

  it('shows the room under the task name', () => {
    render(<TaskList tasks={tasks} rooms={rooms} />)

    const item = screen.getByText('Épousseter').closest('li')!
    expect(within(item).getByText('Salon')).toBeInTheDocument()
  })

  it('distinguishes two tasks with the same name by their room', () => {
    render(
      <TaskList
        tasks={[
          { id: 't1', name: 'Passer le balai', roomId: 'salon' },
          { id: 't2', name: 'Passer le balai', roomId: 'cuisine' },
        ]}
        rooms={rooms}
      />,
    )

    const items = screen.getAllByRole('listitem')
    expect(items.map((item) => item.textContent).sort()).toEqual([
      'Passer le balaiCuisine',
      'Passer le balaiSalon',
    ])
  })

  it('reports the tapped task', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<TaskList tasks={tasks} rooms={rooms} onSelect={onSelect} />)

    await user.click(screen.getByRole('button', { name: /Épousseter/ }))

    expect(onSelect).toHaveBeenCalledWith(tasks[0])
  })
})
