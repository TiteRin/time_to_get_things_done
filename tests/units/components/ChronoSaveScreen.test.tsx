import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Task } from '@/domain/task'
import { ChronoSaveScreen } from '@/components/ChronoSaveScreen'

const task: Task = {
  id: 'a',
  name: 'Faire la vaisselle',
  expectedDuration: 15,
  perceivedDifficulty: 'medium',
}

describe('ChronoSaveScreen', () => {
  it('shows the initially planned duration', () => {
    render(
      <ChronoSaveScreen
        task={task}
        totalMs={0}
        actualMs={0}
        onReplace={vi.fn()}
        onSkip={vi.fn()}
      />,
    )

    expect(screen.getByText('Temps prévu initialement : 15 min')).toBeInTheDocument()
  })

  it('says nothing was planned yet when the task has no duration', () => {
    render(
      <ChronoSaveScreen
        task={{ ...task, expectedDuration: undefined }}
        totalMs={0}
        actualMs={0}
        onReplace={vi.fn()}
        onSkip={vi.fn()}
      />,
    )

    expect(screen.getByText('Aucune durée prévue pour le moment')).toBeInTheDocument()
  })

  it('offers to replace by the total or the effective duration, rounded up to the minute', async () => {
    const onReplace = vi.fn()
    render(
      <ChronoSaveScreen
        task={task}
        totalMs={130_000} // 2.16 min -> 3
        actualMs={70_000} // 1.16 min -> 2
        onReplace={onReplace}
        onSkip={vi.fn()}
      />,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Remplacer par 3 min (temps total)' }))
    expect(onReplace).toHaveBeenLastCalledWith(3, 'medium')

    await userEvent.click(
      screen.getByRole('button', { name: 'Remplacer par 2 min (temps effectif)' }),
    )
    expect(onReplace).toHaveBeenLastCalledWith(2, 'medium')
  })

  it('disables replace buttons when nothing was timed', () => {
    render(
      <ChronoSaveScreen
        task={task}
        totalMs={0}
        actualMs={0}
        onReplace={vi.fn()}
        onSkip={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: /temps total/ })).toBeDisabled()
    expect(screen.getByRole('button', { name: /temps effectif/ })).toBeDisabled()
  })

  it('keeps the duration unchanged, but still reports the chosen difficulty', async () => {
    const onSkip = vi.fn()
    render(
      <ChronoSaveScreen
        task={task}
        totalMs={60_000}
        actualMs={60_000}
        onReplace={vi.fn()}
        onSkip={onSkip}
      />,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Facile' }))
    await userEvent.click(screen.getByRole('button', { name: 'Ne pas remplacer' }))

    expect(onSkip).toHaveBeenCalledExactlyOnceWith('easy')
  })
})
