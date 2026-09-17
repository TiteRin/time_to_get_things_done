import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import { App } from '@/app/App'
import { setupTestDatabases } from '../../helpers/testDatabase'

const openDatabase = setupTestDatabases()

beforeEach(() => window.localStorage.clear())

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App db={openDatabase()} />
    </MemoryRouter>,
  )

/** From the generation screen, selects one task and starts the session */
async function startSession(user: ReturnType<typeof userEvent.setup>) {
  await user.click(
    await screen.findByRole('button', { name: 'Sélectionner Nettoyer les fontaines' }),
  )
  await user.click(screen.getByRole('button', { name: 'Démarrer' }))
}

describe('App', () => {
  it('shows the home screen on the root route', async () => {
    renderAt('/')

    expect(await screen.findByRole('button', { name: 'Générer une liste' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Chronométrer une tâche' })).toBeInTheDocument()
  })

  it('navigates from the home screen to the generation screen', async () => {
    const user = userEvent.setup()
    renderAt('/')

    await user.click(await screen.findByRole('button', { name: 'Générer une liste' }))

    expect(await screen.findByRole('heading', { name: 'Choisir les tâches' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Sélectionner Nettoyer les fontaines' }),
    ).toBeInTheDocument()
  })

  it('starts the execution of the selected tasks', async () => {
    const user = userEvent.setup()
    renderAt('/generation')

    await startSession(user)

    expect(
      await screen.findByRole('heading', { name: 'Nettoyer les fontaines' }),
    ).toBeInTheDocument()
    expect(screen.getByText('1 / 1')).toBeInTheDocument()
  })

  it('shows the configuration page on /configuration', async () => {
    renderAt('/configuration')

    expect(screen.getByRole('heading', { name: 'Configuration' })).toBeInTheDocument()
    expect(await screen.findByText('Nettoyer les fontaines')).toBeInTheDocument()
  })

  it('navigates from the home screen to the configuration page', async () => {
    const user = userEvent.setup()
    renderAt('/')

    await user.click(await screen.findByRole('link', { name: 'Configuration' }))

    expect(screen.getByRole('heading', { name: 'Configuration' })).toBeInTheDocument()
  })

  it('navigates from the configuration page to the generation screen', async () => {
    const user = userEvent.setup()
    renderAt('/configuration')

    await user.click(await screen.findByRole('link', { name: 'Créer une liste' }))

    expect(await screen.findByRole('heading', { name: 'Choisir les tâches' })).toBeInTheDocument()
  })

  it('navigates from the execution menu to the configuration page', async () => {
    const user = userEvent.setup()
    renderAt('/generation')

    await startSession(user)
    await user.click(await screen.findByRole('button', { name: 'Afficher le menu' }))
    await user.click(screen.getByRole('link', { name: 'Configuration' }))

    expect(screen.getByRole('heading', { name: 'Configuration' })).toBeInTheDocument()
  })

  it('navigates from the session end screen back to the generation screen', async () => {
    const user = userEvent.setup()
    renderAt('/generation')

    await startSession(user)
    await user.click(await screen.findByRole('button', { name: 'Afficher le menu' }))
    await user.click(screen.getByRole('button', { name: 'Terminer' }))
    await user.click(screen.getByRole('link', { name: 'Nouvelle liste' }))

    expect(await screen.findByRole('heading', { name: 'Choisir les tâches' })).toBeInTheDocument()
  })

  it('runs the chrono flow: pick a task, time it, and reach the save screen', async () => {
    const user = userEvent.setup()
    renderAt('/')

    await user.click(await screen.findByRole('button', { name: 'Chronométrer une tâche' }))
    await user.click(await screen.findByRole('button', { name: 'Chronométrer Faire la vaisselle' }))

    expect(await screen.findByRole('heading', { name: 'Faire la vaisselle' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Démarrer' }))
    await user.click(screen.getByRole('button', { name: 'Terminer' }))

    expect(await screen.findByText('Mettre à jour « Faire la vaisselle » ?')).toBeInTheDocument()
    // "Ne pas remplacer" stays enabled even when almost no time has elapsed
    await user.click(screen.getByRole('button', { name: 'Ne pas remplacer' }))

    expect(await screen.findByRole('button', { name: 'Générer une liste' })).toBeInTheDocument()
  })

  it('cancels the chrono flow back to the home screen without saving anything', async () => {
    const user = userEvent.setup()
    renderAt('/')

    await user.click(await screen.findByRole('button', { name: 'Chronométrer une tâche' }))
    await user.click(await screen.findByRole('link', { name: 'Annuler' }))

    expect(await screen.findByRole('button', { name: 'Générer une liste' })).toBeInTheDocument()
  })
})
