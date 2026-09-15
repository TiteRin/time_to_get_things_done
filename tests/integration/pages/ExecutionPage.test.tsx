import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { Task } from '@/domain/task'
import { ExecutionPage } from '@/pages/ExecutionPage'

const tasks: Task[] = [
  { id: 'a', name: 'Faire la vaisselle', expectedDuration: 15, perceivedDifficulty: 'medium' },
  { id: 'b', name: 'Faire les litières', expectedDuration: 5, perceivedDifficulty: 'easy' },
]

describe('ExecutionPage', () => {
  it('runs through every task then shows the end screen', async () => {
    const user = userEvent.setup()
    render(<ExecutionPage tasks={tasks} />)

    expect(screen.getByRole('heading', { name: 'Faire la vaisselle' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Démarrer' }))
    await user.click(screen.getByRole('button', { name: 'Tâche suivante' }))

    expect(screen.getByRole('heading', { name: 'Faire les litières' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Démarrer' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Tâche suivante' }))

    expect(screen.getByRole('heading', { name: 'Session terminée' })).toBeInTheDocument()
  })

  it('ends the session early from the top menu', async () => {
    const user = userEvent.setup()
    render(<ExecutionPage tasks={tasks} />)

    await user.click(screen.getByRole('button', { name: 'Afficher le menu' }))
    await user.click(screen.getByRole('button', { name: 'Terminer' }))

    expect(screen.getByRole('heading', { name: 'Session terminée' })).toBeInTheDocument()
  })

  it('uses the sample tasks by default', () => {
    render(<ExecutionPage />)

    expect(
      screen.getByRole('heading', { name: 'Passer le balai dans le salon' }),
    ).toBeInTheDocument()
  })
})
