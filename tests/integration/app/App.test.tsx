import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { App } from '@/app/App'
import { setupTestDatabases } from '../../helpers/testDatabase'

const openDatabase = setupTestDatabases()

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App db={openDatabase()} />
    </MemoryRouter>,
  )

describe('App', () => {
  it('shows the execution screen on the root route', () => {
    renderAt('/')

    expect(
      screen.getByRole('heading', { name: 'Passer le balai dans le salon' }),
    ).toBeInTheDocument()
  })

  it('shows the configuration page on /configuration', async () => {
    renderAt('/configuration')

    expect(screen.getByRole('heading', { name: 'Configuration' })).toBeInTheDocument()
    expect(await screen.findByText('Nettoyer les fontaines')).toBeInTheDocument()
  })

  it('navigates from the configuration page to the execution screen', async () => {
    const user = userEvent.setup()
    renderAt('/configuration')

    await user.click(screen.getByRole('link', { name: 'Lancer la session' }))

    expect(
      screen.getByRole('heading', { name: 'Passer le balai dans le salon' }),
    ).toBeInTheDocument()
  })

  it('navigates from the execution menu to the configuration page', async () => {
    const user = userEvent.setup()
    renderAt('/')

    await user.click(screen.getByRole('button', { name: 'Afficher le menu' }))
    await user.click(screen.getByRole('link', { name: 'Configuration' }))

    expect(screen.getByRole('heading', { name: 'Configuration' })).toBeInTheDocument()
  })

  it('navigates from the session end screen to the configuration page', async () => {
    const user = userEvent.setup()
    renderAt('/')

    await user.click(screen.getByRole('button', { name: 'Afficher le menu' }))
    await user.click(screen.getByRole('button', { name: 'Terminer' }))
    await user.click(screen.getByRole('link', { name: 'Configuration' }))

    expect(screen.getByRole('heading', { name: 'Configuration' })).toBeInTheDocument()
  })
})
