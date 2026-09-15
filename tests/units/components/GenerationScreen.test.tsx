import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Task } from '@/domain/task'
import { GenerationScreen } from '@/components/GenerationScreen'

const tasks: Task[] = [
  {
    id: 'a',
    name: 'Faire la vaisselle',
    expectedDuration: 15,
    perceivedDifficulty: 'medium',
    roomId: 'cuisine',
    equipmentIds: ['eponge', 'introuvable'],
  },
  { id: 'b', name: 'Faire les litières', expectedDuration: 5 },
  { id: 'c', name: 'Ranger le salon', roomId: 'salon' },
]

const rooms = [
  { id: 'salon', name: 'Salon' },
  { id: 'cuisine', name: 'Cuisine' },
]

const equipment = [{ id: 'eponge', name: 'Éponge' }]

const baseProps = {
  step: 'select' as const,
  tasks,
  rooms,
  equipment,
  selected: [tasks[1], tasks[0]],
  onToggle: vi.fn(),
  onRemove: vi.fn(),
  onReorder: vi.fn(),
  onNextStep: vi.fn(),
  onPreviousStep: vi.fn(),
  onStart: vi.fn(),
}

describe('GenerationScreen, selection step', () => {
  it('lists the whole catalogue with a toggle per task', () => {
    render(<GenerationScreen {...baseProps} />)

    expect(screen.getByRole('button', { name: 'Désélectionner Faire la vaisselle' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Désélectionner Faire les litières' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Sélectionner Ranger le salon' })).toBeVisible()
  })

  it('groups the tasks by room, rooms sorted by name, roomless tasks last', () => {
    render(<GenerationScreen {...baseProps} />)

    const headings = screen.getAllByRole('heading', { level: 2 })
    expect(headings.map((heading) => heading.textContent)).toEqual([
      'Cuisine',
      'Salon',
      'Aucune pièce',
    ])
  })

  it('shows the duration, difficulty and known equipment of each task', () => {
    render(<GenerationScreen {...baseProps} />)

    expect(
      screen.getByText('Durée : 15 min · Difficulté : Moyen · Matériel : Éponge'),
    ).toBeVisible()
    expect(screen.queryByText(/introuvable/)).not.toBeInTheDocument()
  })

  it('labels missing duration and difficulty anyway', () => {
    render(<GenerationScreen {...baseProps} />)

    expect(screen.getByText('Durée : 5 min · Difficulté : non renseignée')).toBeVisible()
    expect(screen.getByText('Durée : non renseignée · Difficulté : non renseignée')).toBeVisible()
  })

  it('reports a toggled task', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    render(<GenerationScreen {...baseProps} onToggle={onToggle} />)

    await user.click(screen.getByRole('button', { name: 'Sélectionner Ranger le salon' }))

    expect(onToggle).toHaveBeenCalledWith('c')
  })

  it('sums up the selection and its approximate duration', () => {
    render(<GenerationScreen {...baseProps} />)

    expect(
      screen.getByText('2 tâches sélectionnées, durée approximative ~ 20 minutes'),
    ).toBeVisible()
  })

  it('uses the singular for a single selected task', () => {
    render(<GenerationScreen {...baseProps} selected={[tasks[1]]} />)

    expect(screen.getByText('1 tâche sélectionnée, durée approximative ~ 5 minutes')).toBeVisible()
  })

  it('moves to the next step and starts the session', async () => {
    const user = userEvent.setup()
    render(<GenerationScreen {...baseProps} />)

    await user.click(screen.getByRole('button', { name: 'Étape suivante' }))
    expect(baseProps.onNextStep).toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Démarrer' }))
    expect(baseProps.onStart).toHaveBeenCalled()
  })

  it('cannot proceed with an empty selection', () => {
    render(<GenerationScreen {...baseProps} selected={[]} />)

    expect(screen.getByRole('button', { name: 'Étape suivante' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Démarrer' })).toBeDisabled()
  })
})

describe('GenerationScreen, ordering step', () => {
  const orderProps = { ...baseProps, step: 'order' as const }

  it('lists only the selected tasks, in selection order', () => {
    render(<GenerationScreen {...orderProps} />)

    const items = screen.getAllByRole('listitem')
    expect(items.map((item) => item.textContent)).toEqual([
      expect.stringContaining('Faire les litières'),
      expect.stringContaining('Faire la vaisselle'),
    ])
    expect(screen.queryByText('Ranger le salon')).not.toBeInTheDocument()
  })

  it('shows the room of each selected task, or the roomless label', () => {
    render(<GenerationScreen {...orderProps} />)

    const items = screen.getAllByRole('listitem')
    expect(items[0].textContent).toContain('Aucune pièce')
    expect(items[1].textContent).toContain('Cuisine')
  })

  it('reports a removed task', async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    render(<GenerationScreen {...orderProps} onRemove={onRemove} />)

    await user.click(screen.getByRole('button', { name: 'Retirer Faire les litières' }))

    expect(onRemove).toHaveBeenCalledWith('b')
  })

  it('goes back to the selection step', async () => {
    const user = userEvent.setup()
    render(<GenerationScreen {...orderProps} />)

    await user.click(screen.getByRole('button', { name: 'Étape précédente' }))

    expect(baseProps.onPreviousStep).toHaveBeenCalled()
  })

  it('reorders the selection from the keyboard', async () => {
    const user = userEvent.setup()
    const onReorder = vi.fn()
    render(<GenerationScreen {...orderProps} onReorder={onReorder} />)

    const handle = within(screen.getAllByRole('listitem')[0]).getByRole('button', {
      name: 'Déplacer Faire les litières',
    })
    handle.focus()
    await user.keyboard('{ArrowDown}')
    expect(onReorder).toHaveBeenCalledWith(0, 1)

    await user.keyboard('{ArrowUp}')
    expect(onReorder).toHaveBeenCalledWith(0, -1)
  })
})
