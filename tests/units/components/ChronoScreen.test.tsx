import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Task } from '@/domain/task'
import { ChronoScreen, type ChronoScreenProps } from '@/components/ChronoScreen'

const task: Task = { id: 'a', name: 'Faire la vaisselle' }

function setup(overrides: Partial<ChronoScreenProps> = {}) {
  const props: ChronoScreenProps = {
    task,
    status: 'idle',
    elapsedMs: 0,
    onToggle: vi.fn(),
    onFinish: vi.fn(),
    onCancel: vi.fn(),
    ...overrides,
  }
  render(<ChronoScreen {...props} />)
  return props
}

describe('ChronoScreen', () => {
  it('shows the task name and the elapsed time as mm:ss:cc, for a dynamic display', () => {
    setup({ elapsedMs: 65_234 })

    expect(screen.getByRole('heading', { name: 'Faire la vaisselle' })).toBeInTheDocument()
    expect(screen.getByText('01:05:23')).toBeInTheDocument()
  })

  it.each([
    ['idle', 'Démarrer'],
    ['running', 'Pause'],
    ['paused', 'Reprendre'],
  ] as const)('labels the center zone according to status %s', (status, label) => {
    setup({ status })

    expect(screen.getByRole('button', { name: label })).toBeInTheDocument()
  })

  it('toggles the timer when tapping the center', async () => {
    const props = setup()

    await userEvent.click(screen.getByRole('button', { name: 'Démarrer' }))

    expect(props.onToggle).toHaveBeenCalledOnce()
  })

  it('hides Terminer before the task is started', () => {
    setup({ status: 'idle' })

    expect(screen.queryByRole('button', { name: 'Terminer' })).not.toBeInTheDocument()
  })

  it.each(['running', 'paused'] as const)(
    'shows Terminer once the task has been started (status %s)',
    (status) => {
      setup({ status })

      expect(screen.getByRole('button', { name: 'Terminer' })).toBeInTheDocument()
    },
  )

  it('finishes the chrono when tapping Terminer', async () => {
    const props = setup({ status: 'running' })

    await userEvent.click(screen.getByRole('button', { name: 'Terminer' }))

    expect(props.onFinish).toHaveBeenCalledOnce()
  })

  it('cancels immediately when tapping Annuler before the task is started', async () => {
    const props = setup({ status: 'idle' })

    await userEvent.click(screen.getByRole('button', { name: 'Annuler' }))

    expect(props.onCancel).toHaveBeenCalledOnce()
    expect(props.onFinish).not.toHaveBeenCalled()
  })

  it.each(['running', 'paused'] as const)(
    'asks for confirmation when tapping Annuler once the task has started (status %s)',
    async (status) => {
      const props = setup({ status })

      await userEvent.click(screen.getByRole('button', { name: 'Annuler' }))

      expect(props.onCancel).not.toHaveBeenCalled()
      expect(screen.getByText('Abandonner ce chronométrage ?')).toBeInTheDocument()
    },
  )

  it('cancels once the abandon is confirmed', async () => {
    const props = setup({ status: 'running' })

    await userEvent.click(screen.getByRole('button', { name: 'Annuler' }))
    await userEvent.click(screen.getByRole('button', { name: 'Abandonner' }))

    expect(props.onCancel).toHaveBeenCalledOnce()
  })

  it('keeps timing when the confirmation is dismissed', async () => {
    const props = setup({ status: 'running' })

    await userEvent.click(screen.getByRole('button', { name: 'Annuler' }))
    await userEvent.click(screen.getByRole('button', { name: 'Continuer' }))

    expect(props.onCancel).not.toHaveBeenCalled()
    expect(screen.queryByText('Abandonner ce chronométrage ?')).not.toBeInTheDocument()
  })
})
