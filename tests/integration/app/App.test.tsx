import { render, screen } from '@testing-library/react'
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
})
