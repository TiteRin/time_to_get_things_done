import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Equipment } from '@/domain/equipment'
import type { Room } from '@/domain/room'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { TaskForm } from '@/components/TaskForm'

const rooms: Room[] = [
  { id: 'salon', name: 'Salon' },
  { id: 'cuisine', name: 'Cuisine' },
]

const equipment: Equipment[] = [
  { id: 'balai', name: 'Balai' },
  { id: 'aspirateur', name: 'Aspirateur' },
]

function setup(props: Partial<React.ComponentProps<typeof TaskForm>> = {}) {
  const onSubmit = vi.fn()
  const onAddRoom = vi.fn(async (name: string): Promise<Room> => ({ id: `room-${name}`, name }))
  const onAddEquipment = vi.fn(async (name: string): Promise<Equipment> => ({
    id: `equipment-${name}`,
    name,
  }))
  render(
    <TaskForm
      rooms={rooms}
      equipment={equipment}
      onSubmit={onSubmit}
      onAddRoom={onAddRoom}
      onAddEquipment={onAddEquipment}
      {...props}
    />,
  )
  return { onSubmit, onAddRoom, onAddEquipment }
}

describe('TaskForm', () => {
  it('shows every field of a task', () => {
    setup()

    expect(screen.getByRole('textbox', { name: 'Nom' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Durée prévue' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Difficulté perçue' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Pièce' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Ajouter du matériel' })).toBeInTheDocument()
  })

  it('submits the filled-in task', async () => {
    const { onSubmit } = setup()

    await userEvent.type(screen.getByRole('textbox', { name: 'Nom' }), 'Passer le balai')
    await userEvent.click(screen.getByRole('button', { name: '15 min' }))
    await userEvent.click(screen.getByRole('button', { name: 'Facile' }))
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Pièce' }), 'Cuisine')
    await userEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Passer le balai',
      expectedDuration: 15,
      perceivedDifficulty: 'easy',
      roomId: 'cuisine',
    })
  })

  it('submits a task with just a name', async () => {
    const { onSubmit } = setup()

    await userEvent.type(screen.getByRole('textbox', { name: 'Nom' }), 'Ranger')
    await userEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))

    expect(onSubmit).toHaveBeenCalledWith({ name: 'Ranger' })
  })

  it('shows the validation message instead of submitting an unnamed task', async () => {
    const { onSubmit } = setup()

    await userEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Le nom de la tâche est obligatoire')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('clears the validation message once submission succeeds', async () => {
    setup()

    await userEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))
    await userEvent.type(screen.getByRole('textbox', { name: 'Nom' }), 'Ranger')
    await userEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('prefills the fields from an existing task', () => {
    setup({
      task: {
        id: 't1',
        name: 'Aspirer',
        expectedDuration: 30,
        perceivedDifficulty: 'hard',
        roomId: 'salon',
        equipmentIds: ['aspirateur'],
      },
    })

    expect(screen.getByRole('textbox', { name: 'Nom' })).toHaveValue('Aspirer')
    expect(screen.getByRole('button', { name: '30 min' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Difficile' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('combobox', { name: 'Pièce' })).toHaveValue('salon')
    expect(screen.getByRole('button', { name: 'Retirer Aspirateur' })).toBeInTheDocument()
  })

  it('does not submit the form when adding a room or equipment with Enter', async () => {
    const { onSubmit } = setup()

    await userEvent.click(screen.getByRole('button', { name: 'Nouvelle pièce' }))
    await userEvent.type(screen.getByRole('textbox', { name: 'Nom de la pièce' }), 'Bureau{enter}')
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Ajouter du matériel' }),
      'Serpillière{enter}',
    )

    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('selects a newly added room', async () => {
    const { onSubmit, onAddRoom } = setup()

    await userEvent.click(screen.getByRole('button', { name: 'Nouvelle pièce' }))
    await userEvent.type(screen.getByRole('textbox', { name: 'Nom de la pièce' }), 'Bureau{enter}')
    await userEvent.type(screen.getByRole('textbox', { name: 'Nom' }), 'Trier les papiers')
    await userEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))

    expect(onAddRoom).toHaveBeenCalledWith('Bureau')
    expect(onSubmit).toHaveBeenCalledWith({ name: 'Trier les papiers', roomId: 'room-Bureau' })
  })

  it('tags newly added equipment', async () => {
    const { onSubmit, onAddEquipment } = setup()

    await userEvent.type(
      screen.getByRole('textbox', { name: 'Ajouter du matériel' }),
      'Serpillière{enter}',
    )
    await userEvent.type(screen.getByRole('textbox', { name: 'Nom' }), 'Laver le sol')
    await userEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))

    expect(onAddEquipment).toHaveBeenCalledWith('Serpillière')
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Laver le sol',
      equipmentIds: ['equipment-Serpillière'],
    })
  })

  describe('unexpected persistence failures reach the error boundary', () => {
    function setupInBoundary(props: Partial<React.ComponentProps<typeof TaskForm>> = {}) {
      // React logs the caught error; keep the test output clean
      vi.spyOn(console, 'error').mockImplementation(() => {})
      render(
        <ErrorBoundary>
          <TaskForm
            rooms={rooms}
            equipment={equipment}
            onSubmit={vi.fn()}
            onAddRoom={vi.fn(async (name: string): Promise<Room> => ({ id: `room-${name}`, name }))}
            onAddEquipment={vi.fn(async (name: string): Promise<Equipment> => ({
              id: `equipment-${name}`,
              name,
            }))}
            {...props}
          />
        </ErrorBoundary>,
      )
    }

    it('when saving the task fails', async () => {
      setupInBoundary({ onSubmit: vi.fn().mockRejectedValue(new Error('Tâche introuvable')) })

      await userEvent.type(screen.getByRole('textbox', { name: 'Nom' }), 'Laver le sol')
      await userEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))

      expect(
        await screen.findByRole('heading', { name: 'Une erreur est survenue' }),
      ).toBeInTheDocument()
    })

    it('when creating a room fails', async () => {
      setupInBoundary({ onAddRoom: vi.fn().mockRejectedValue(new Error('boom')) })

      await userEvent.click(screen.getByRole('button', { name: 'Nouvelle pièce' }))
      const input = screen.getByRole('textbox', { name: 'Nom de la pièce' })
      await userEvent.type(input, 'Bureau')
      await userEvent.click(within(input.closest('div')!).getByRole('button', { name: 'Ajouter' }))

      expect(
        await screen.findByRole('heading', { name: 'Une erreur est survenue' }),
      ).toBeInTheDocument()
    })

    it('when creating equipment fails', async () => {
      setupInBoundary({ onAddEquipment: vi.fn().mockRejectedValue(new Error('boom')) })

      await userEvent.type(
        screen.getByRole('textbox', { name: 'Ajouter du matériel' }),
        'Serpillière{enter}',
      )

      expect(
        await screen.findByRole('heading', { name: 'Une erreur est survenue' }),
      ).toBeInTheDocument()
    })
  })
})
