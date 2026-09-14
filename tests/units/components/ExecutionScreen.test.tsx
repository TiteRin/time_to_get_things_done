import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Task } from '@/domain/task'
import { ExecutionScreen, type ExecutionScreenProps } from '@/components/ExecutionScreen'

const task: Task = {
  id: 'a',
  name: 'Faire la vaisselle',
  expectedDuration: 15,
  perceivedDifficulty: 'medium',
}

function setup(overrides: Partial<ExecutionScreenProps> = {}) {
  const props: ExecutionScreenProps = {
    task,
    status: 'idle',
    menuOpen: false,
    position: 1,
    total: 3,
    onToggle: vi.fn(),
    onNext: vi.fn(),
    onOpenMenu: vi.fn(),
    onCloseMenu: vi.fn(),
    onFinish: vi.fn(),
    ...overrides,
  }
  render(<ExecutionScreen {...props} />)
  return props
}

describe('ExecutionScreen', () => {
  it('shows the current task name and progress', () => {
    setup()

    expect(screen.getByRole('heading', { name: 'Faire la vaisselle' })).toBeInTheDocument()
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })

  it.each([
    ['idle', 'Démarrer'],
    ['running', 'Pause'],
    ['paused', 'Reprendre'],
  ] as const)('labels the center zone according to status %s', (status, label) => {
    setup({ status })

    expect(screen.getByRole('button', { name: label })).toBeInTheDocument()
  })

  it('never displays elapsed time', () => {
    setup({ status: 'running' })

    expect(screen.queryByText(/\d+:\d{2}/)).not.toBeInTheDocument()
  })

  it('toggles the timer when tapping the center', async () => {
    const props = setup()

    await userEvent.click(screen.getByRole('button', { name: 'Démarrer' }))

    expect(props.onToggle).toHaveBeenCalledOnce()
  })

  it('goes to the next task when tapping the bottom', async () => {
    const props = setup()

    await userEvent.click(screen.getByRole('button', { name: 'Tâche suivante' }))

    expect(props.onNext).toHaveBeenCalledOnce()
  })

  it('opens the menu when tapping the top', async () => {
    const props = setup()

    await userEvent.click(screen.getByRole('button', { name: 'Afficher le menu' }))

    expect(props.onOpenMenu).toHaveBeenCalledOnce()
  })

  it('goes to the next task on swipe up without toggling the timer', () => {
    const props = setup()
    const center = screen.getByRole('button', { name: 'Démarrer' })

    fireEvent.pointerDown(center, { clientX: 100, clientY: 500 })
    fireEvent.pointerUp(center, { clientX: 100, clientY: 300 })
    fireEvent.click(center)

    expect(props.onNext).toHaveBeenCalledOnce()
    expect(props.onToggle).not.toHaveBeenCalled()
  })

  it('shows the menu and wires its actions when open', async () => {
    const props = setup({ menuOpen: true })

    await userEvent.click(screen.getByRole('button', { name: 'Annuler' }))
    expect(props.onCloseMenu).toHaveBeenCalledOnce()

    await userEvent.click(screen.getByRole('button', { name: 'Terminer' }))
    expect(props.onFinish).toHaveBeenCalledOnce()
  })

  it('does not react to swipes while the menu is open', () => {
    const props = setup({ menuOpen: true })
    const dialog = screen.getByRole('dialog')

    fireEvent.pointerDown(dialog, { clientX: 100, clientY: 500 })
    fireEvent.pointerUp(dialog, { clientX: 100, clientY: 300 })

    expect(props.onNext).not.toHaveBeenCalled()
  })

  it('hints that the last task ends the session', () => {
    setup({ position: 3, total: 3 })

    expect(screen.getByText('Dernière tâche')).toBeInTheDocument()
  })
})
