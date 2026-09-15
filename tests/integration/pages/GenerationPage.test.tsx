import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import type { TtgtdDatabase } from '@/db/database'
import { GenerationPage } from '@/pages/GenerationPage'
import * as taskRepository from '@/repositories/taskRepository'
import { loadLastList, saveLastList } from '@/storage/lastList'
import { databaseWrapper, setupTestDatabases } from '../../helpers/testDatabase'

const openDatabase = setupTestDatabases()

beforeEach(() => window.localStorage.clear())

function wrapper(db: TtgtdDatabase) {
  const DatabaseWrapper = databaseWrapper(db)
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter>
        <DatabaseWrapper>
          <Routes>
            <Route path="/" element={children} />
            <Route path="/execution" element={<h1>Écran d’exécution</h1>} />
          </Routes>
        </DatabaseWrapper>
      </MemoryRouter>
    )
  }
}

describe('GenerationPage', () => {
  it('lists the stored catalogue with toggles', async () => {
    render(<GenerationPage />, { wrapper: wrapper(openDatabase()) })

    expect(
      await screen.findByRole('button', { name: 'Sélectionner Nettoyer les fontaines' }),
    ).toBeInTheDocument()
    expect(screen.getByText('0 tâche sélectionnée, durée approximative ~ 0 minutes')).toBeVisible()
  })

  it('selects tasks, orders them on step two and removes one', async () => {
    const user = userEvent.setup()
    render(<GenerationPage />, { wrapper: wrapper(openDatabase()) })

    await user.click(
      await screen.findByRole('button', { name: 'Sélectionner Nettoyer les fontaines' }),
    )
    await user.click(screen.getByRole('button', { name: 'Sélectionner Faire la vaisselle' }))
    expect(screen.getByText(/2 tâches sélectionnées/)).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Étape suivante' }))
    expect(screen.getByRole('button', { name: 'Retirer Nettoyer les fontaines' })).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Retirer Nettoyer les fontaines' }))
    expect(screen.getByText(/1 tâche sélectionnée/)).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Étape précédente' }))
    expect(screen.getByRole('button', { name: 'Désélectionner Faire la vaisselle' })).toBeVisible()
  })

  it('saves the list and navigates to the execution screen on start', async () => {
    const user = userEvent.setup()
    const db = openDatabase()
    render(<GenerationPage />, { wrapper: wrapper(db) })

    await user.click(await screen.findByRole('button', { name: 'Sélectionner Faire la vaisselle' }))
    await user.click(screen.getByRole('button', { name: 'Démarrer' }))

    expect(screen.getByRole('heading', { name: 'Écran d’exécution' })).toBeInTheDocument()
    const tasks = await taskRepository.listTasks(db)
    const dishes = tasks.find((task) => task.name === 'Faire la vaisselle')!
    expect(loadLastList()).toEqual([dishes.id])
  })

  it('restores the last saved list, ignoring deleted tasks', async () => {
    const db = openDatabase()
    const tasks = await taskRepository.listTasks(db)
    const dishes = tasks.find((task) => task.name === 'Faire la vaisselle')!
    saveLastList([dishes.id, 'id-de-tache-supprimee'])

    render(<GenerationPage />, { wrapper: wrapper(db) })

    expect(
      await screen.findByRole('button', { name: 'Désélectionner Faire la vaisselle' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/1 tâche sélectionnée/)).toBeVisible()
  })
})
