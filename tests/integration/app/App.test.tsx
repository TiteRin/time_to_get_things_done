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
  it('shows the generation screen on the root route', async () => {
    renderAt('/')

    expect(screen.getByRole('heading', { name: 'Choisir les tâches' })).toBeInTheDocument()
    expect(
      await screen.findByRole('button', { name: 'Sélectionner Nettoyer les fontaines' }),
    ).toBeInTheDocument()
  })

  it('starts the execution of the selected tasks', async () => {
    const user = userEvent.setup()
    renderAt('/')

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

  it('navigates from the configuration page to the generation screen', async () => {
    const user = userEvent.setup()
    renderAt('/configuration')

    await user.click(screen.getByRole('link', { name: 'Créer une liste' }))

    expect(screen.getByRole('heading', { name: 'Choisir les tâches' })).toBeInTheDocument()
  })

  it('navigates from the execution menu to the configuration page', async () => {
    const user = userEvent.setup()
    renderAt('/')

    await startSession(user)
    await user.click(await screen.findByRole('button', { name: 'Afficher le menu' }))
    await user.click(screen.getByRole('link', { name: 'Configuration' }))

    expect(screen.getByRole('heading', { name: 'Configuration' })).toBeInTheDocument()
  })

  it('navigates from the session end screen back to the generation screen', async () => {
    const user = userEvent.setup()
    renderAt('/')

    await startSession(user)
    await user.click(await screen.findByRole('button', { name: 'Afficher le menu' }))
    await user.click(screen.getByRole('button', { name: 'Terminer' }))
    await user.click(screen.getByRole('link', { name: 'Nouvelle liste' }))

    expect(screen.getByRole('heading', { name: 'Choisir les tâches' })).toBeInTheDocument()
  })
})
