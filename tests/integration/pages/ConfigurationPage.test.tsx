import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  it('creates a task from the form then shows it in the list', async () => {
    const user = userEvent.setup()
    const db = openDatabase()
    render(<ConfigurationPage />, { wrapper: databaseWrapper(db) })

    await user.click(await screen.findByRole('button', { name: 'Ajouter une tâche' }))
    await user.type(screen.getByLabelText('Nom'), 'Arroser les plantes')
    await user.click(screen.getByRole('button', { name: 'Enregistrer' }))

    expect(await screen.findByText('Arroser les plantes')).toBeInTheDocument()
    expect(screen.queryByLabelText('Nom')).not.toBeInTheDocument()
    expect(await db.tasks.filter((task) => task.name === 'Arroser les plantes').count()).toBe(1)
  })

  it('edits a task tapped in the list', async () => {
    const user = userEvent.setup()
    const db = openDatabase()
    render(<ConfigurationPage />, { wrapper: databaseWrapper(db) })

    await user.click(await screen.findByRole('button', { name: /Nettoyer les fontaines/ }))

    const nameField = screen.getByLabelText('Nom')
    expect(nameField).toHaveValue('Nettoyer les fontaines')
    await user.clear(nameField)
    await user.type(nameField, "Nettoyer les fontaines d'eau")
    await user.click(screen.getByRole('button', { name: 'Enregistrer' }))

    expect(await screen.findByText("Nettoyer les fontaines d'eau")).toBeInTheDocument()
    const stored = await db.tasks.get('salon-nettoyer-les-fontaines')
    expect(stored?.name).toBe("Nettoyer les fontaines d'eau")
  })
})
