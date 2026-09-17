import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import type { TtgtdDatabase } from '@/db/database'
import type { Task } from '@/domain/task'
import { ExecutionPage } from '@/pages/ExecutionPage'
import * as taskRepository from '@/repositories/taskRepository'
import { saveLastList } from '@/storage/lastList'
import { databaseWrapper, setupTestDatabases } from '../../helpers/testDatabase'

const openDatabase = setupTestDatabases()

beforeEach(() => window.localStorage.clear())

function routedWrapper(db: TtgtdDatabase) {
  const DatabaseWrapper = databaseWrapper(db)
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={['/execution']}>
        <DatabaseWrapper>
          <Routes>
            <Route path="/generation" element={<h1>Écran de génération</h1>} />
            <Route path="/execution" element={children} />
          </Routes>
        </DatabaseWrapper>
      </MemoryRouter>
    )
  }
}

const tasks: Task[] = [
  { id: 'a', name: 'Faire la vaisselle', expectedDuration: 15, perceivedDifficulty: 'medium' },
  { id: 'b', name: 'Faire les litières', expectedDuration: 5, perceivedDifficulty: 'easy' },
]

describe('ExecutionPage', () => {
  it('runs through every task then shows the end screen', async () => {
    const user = userEvent.setup()
    render(<ExecutionPage tasks={tasks} />, { wrapper: MemoryRouter })

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
    render(<ExecutionPage tasks={tasks} />, { wrapper: MemoryRouter })

    await user.click(screen.getByRole('button', { name: 'Afficher le menu' }))
    await user.click(screen.getByRole('button', { name: 'Terminer' }))

    expect(screen.getByRole('heading', { name: 'Session terminée' })).toBeInTheDocument()
  })

  it('runs the last saved list, in its saved order', async () => {
    const db = openDatabase()
    const stored = await taskRepository.listTasks(db)
    const findId = (name: string) => stored.find((task) => task.name === name)!.id
    saveLastList([findId('Faire la vaisselle'), findId('Faire les litières')])

    render(<ExecutionPage />, { wrapper: routedWrapper(db) })

    expect(await screen.findByRole('heading', { name: 'Faire la vaisselle' })).toBeInTheDocument()
    expect(screen.getByText('1 / 2')).toBeInTheDocument()
  })

  it('goes back to the generation screen without a saved list', async () => {
    render(<ExecutionPage />, { wrapper: routedWrapper(openDatabase()) })

    expect(await screen.findByRole('heading', { name: 'Écran de génération' })).toBeInTheDocument()
  })
})
