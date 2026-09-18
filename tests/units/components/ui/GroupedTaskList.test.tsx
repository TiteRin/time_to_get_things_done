import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GroupedTaskList } from '@/components/ui/GroupedTaskList'
import type { Room } from '@/domain/room'
import type { Task } from '@/domain/task'

const rooms: Room[] = [
  { id: 'salon', name: 'Salon' },
  { id: 'cuisine', name: 'Cuisine' },
]
const tasks: Task[] = [
  { id: 'vaisselle', name: 'Vaisselle', roomId: 'cuisine' },
  { id: 'aspirateur', name: 'Aspirateur', roomId: 'salon' },
  { id: 'balai', name: 'Balai', roomId: 'cuisine' },
  { id: 'courrier', name: 'Courrier' },
]

describe('GroupedTaskList', () => {
  it('lists tasks under a heading per room, rooms sorted, roomless tasks last', () => {
    render(<GroupedTaskList tasks={tasks} rooms={rooms} renderRow={(task) => task.name} />)

    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'Cuisine',
      'Salon',
      'Aucune pièce',
    ])
    const [cuisine] = screen.getAllByRole('list')
    expect(
      within(cuisine)
        .getAllByRole('listitem')
        .map((li) => li.textContent),
    ).toEqual(['Balai', 'Vaisselle'])
  })

  it('renders each row with renderRow, applying rowClassName to its item', () => {
    render(
      <GroupedTaskList
        tasks={tasks}
        rooms={rooms}
        rowClassName="flex"
        renderRow={(task) => <button type="button">Chronométrer {task.name}</button>}
      />,
    )

    const button = screen.getByRole('button', { name: 'Chronométrer Courrier' })
    expect(button.closest('li')).toHaveClass('flex')
  })

  it('renders nothing but an empty container without tasks', () => {
    render(<GroupedTaskList tasks={[]} rooms={rooms} renderRow={(task) => task.name} />)

    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })
})
