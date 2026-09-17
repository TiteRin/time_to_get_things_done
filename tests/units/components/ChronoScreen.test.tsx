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
  it('shows the task name and the elapsed time, unlike the execution screen', () => {
    setup({ elapsedMs: 65_000 })

    expect(screen.getByRole('heading', { name: 'Faire la vaisselle' })).toBeInTheDocument()
    expect(screen.getByText('01:05')).toBeInTheDocument()
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

  it('finishes the chrono when tapping Terminer', async () => {
    const props = setup({ status: 'running' })

    await userEvent.click(screen.getByRole('button', { name: 'Terminer' }))

    expect(props.onFinish).toHaveBeenCalledOnce()
  })

  it('cancels without finishing when tapping Annuler', async () => {
    const props = setup()

    await userEvent.click(screen.getByRole('button', { name: 'Annuler' }))

    expect(props.onCancel).toHaveBeenCalledOnce()
    expect(props.onFinish).not.toHaveBeenCalled()
  })
})
