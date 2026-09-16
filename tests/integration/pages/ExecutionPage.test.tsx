import { render, screen, waitFor, within } from '@testing-library/react'
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

function routedWrapper(db: TtgtdDatabase = openDatabase()) {
  const DatabaseWrapper = databaseWrapper(db)
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={['/execution']}>
        <DatabaseWrapper>
          <Routes>
            <Route path="/" element={<h1>Écran de génération</h1>} />
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
    render(<ExecutionPage tasks={tasks} />, { wrapper: routedWrapper() })

    expect(screen.getByRole('heading', { name: 'Faire la vaisselle' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Démarrer' }))
    await user.click(screen.getByRole('button', { name: 'Tâche suivante' }))

    expect(screen.getByRole('heading', { name: 'Faire les litières' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Démarrer' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Tâche suivante' }))

    expect(await screen.findByRole('heading', { name: 'Bravo !' })).toBeInTheDocument()
  })

  it('ends the session early from the top menu', async () => {
    const user = userEvent.setup()
    render(<ExecutionPage tasks={tasks} />, { wrapper: routedWrapper() })

    await user.click(screen.getByRole('button', { name: 'Afficher le menu' }))
    await user.click(screen.getByRole('button', { name: 'Terminer' }))

    expect(await screen.findByRole('heading', { name: 'Bravo !' })).toBeInTheDocument()
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

  it('updates the expected duration from the debriefing, then closes it', async () => {
    const user = userEvent.setup()
    const db = openDatabase()
    const stored = await taskRepository.listTasks(db)
    const dishes = stored.find((task) => task.name === 'Faire la vaisselle')!
    saveLastList([dishes.id])

    render(<ExecutionPage />, { wrapper: routedWrapper(db) })

    await user.click(await screen.findByRole('button', { name: 'Démarrer' }))
    await user.click(screen.getByRole('button', { name: 'Tâche suivante' }))
    expect(
      await screen.findByText('1 tâche effectuée sur 1, temps passé : 0 minute'),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Faire la vaisselle' }))
    await user.click(screen.getByRole('button', { name: 'Modifier la durée prévue' }))
    const input = screen.getByRole('spinbutton', { name: 'Durée prévue (minutes)' })
    await user.clear(input)
    await user.type(input, '12')
    await user.click(screen.getByRole('button', { name: 'Enregistrer' }))

    await waitFor(async () => expect((await db.tasks.get(dishes.id))?.expectedDuration).toBe(12))
    // The live query re-renders after the write: wait for the text, not just the button
    await waitFor(() =>
      expect(
        within(screen.getByRole('dialog')).getByRole('button', {
          name: 'Modifier la durée prévue',
        }),
      ).toHaveTextContent('12 min'),
    )

    await user.click(screen.getByRole('button', { name: 'Fermer le détail' }))
    await user.click(screen.getByRole('button', { name: 'Fermer' }))
    expect(await screen.findByRole('heading', { name: 'Écran de génération' })).toBeInTheDocument()
  })

  it('shows the perceived difficulty as selected once corrected', async () => {
    const user = userEvent.setup()
    const db = openDatabase()
    const stored = await taskRepository.listTasks(db)
    const dishes = stored.find((task) => task.name === 'Faire la vaisselle')!
    saveLastList([dishes.id])

    render(<ExecutionPage />, { wrapper: routedWrapper(db) })

    await user.click(await screen.findByRole('button', { name: 'Démarrer' }))
    await user.click(screen.getByRole('button', { name: 'Tâche suivante' }))
    await user.click(await screen.findByRole('button', { name: 'Faire la vaisselle' }))
    await user.click(screen.getByRole('button', { name: 'Renseigner la difficulté' }))

    const perceived = within(screen.getByRole('group', { name: 'Difficulté perçue' }))
    await user.click(perceived.getByRole('button', { name: 'Difficile' }))

    await waitFor(() =>
      expect(perceived.getByRole('button', { name: 'Difficile' })).toHaveAttribute(
        'aria-pressed',
        'true',
      ),
    )
  })

  it('goes back to the generation screen without a saved list', async () => {
    render(<ExecutionPage />, { wrapper: routedWrapper(openDatabase()) })

    expect(await screen.findByRole('heading', { name: 'Écran de génération' })).toBeInTheDocument()
  })
})
