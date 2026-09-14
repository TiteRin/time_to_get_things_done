import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Room } from '@/domain/room'
import { RoomSelect } from '@/components/RoomSelect'

const rooms: Room[] = [
  { id: 'salon', name: 'Salon' },
  { id: 'cuisine', name: 'Cuisine' },
]

function setup(props: Partial<React.ComponentProps<typeof RoomSelect>> = {}) {
  const onChange = vi.fn()
  const onAddRoom = vi.fn()
  render(<RoomSelect rooms={rooms} onChange={onChange} onAddRoom={onAddRoom} {...props} />)
  return { onChange, onAddRoom }
}

describe('RoomSelect', () => {
  it('lists the rooms plus a "no room" option, and reflects the value', () => {
    setup({ value: 'cuisine' })

    const select = screen.getByRole('combobox', { name: 'Pièce' })
    expect(select).toHaveValue('cuisine')
    expect(screen.getByRole('option', { name: 'Aucune pièce' })).toBeInTheDocument()
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual([
      'Aucune pièce',
      'Salon',
      'Cuisine',
    ])
  })

  it('selects a room', async () => {
    const { onChange } = setup()

    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Pièce' }), 'Salon')

    expect(onChange).toHaveBeenCalledWith('salon')
  })

  it('clears the room when picking "Aucune pièce"', async () => {
    const { onChange } = setup({ value: 'salon' })

    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Pièce' }), 'Aucune pièce')

    expect(onChange).toHaveBeenCalledWith(undefined)
  })

  it('adds a new room from a revealed input', async () => {
    const { onAddRoom } = setup()

    await userEvent.click(screen.getByRole('button', { name: 'Nouvelle pièce' }))
    await userEvent.type(screen.getByRole('textbox', { name: 'Nom de la pièce' }), 'Bureau')
    await userEvent.click(screen.getByRole('button', { name: 'Ajouter' }))

    expect(onAddRoom).toHaveBeenCalledWith('Bureau')
  })

  it('does not add a blank room', async () => {
    const { onAddRoom } = setup()

    await userEvent.click(screen.getByRole('button', { name: 'Nouvelle pièce' }))
    await userEvent.click(screen.getByRole('button', { name: 'Ajouter' }))

    expect(onAddRoom).not.toHaveBeenCalled()
  })
})
