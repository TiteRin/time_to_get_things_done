import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ConfigurationPage } from '@/pages/ConfigurationPage'
import { databaseWrapper, setupTestDatabases } from '../../helpers/testDatabase'

const openDatabase = setupTestDatabases()

describe('ConfigurationPage', () => {
  it('lists the stored tasks with their room', async () => {
    render(<ConfigurationPage />, { wrapper: databaseWrapper(openDatabase()) })

    expect(await screen.findByText('Nettoyer les fontaines')).toBeInTheDocument()
    expect(screen.getAllByText('Salon').length).toBeGreaterThan(0)
  })
})
