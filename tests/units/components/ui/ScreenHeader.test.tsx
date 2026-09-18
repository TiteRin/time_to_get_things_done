import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ScreenHeader } from '@/components/ui/ScreenHeader'

describe('ScreenHeader', () => {
  it('shows the screen title as its main heading', () => {
    render(<ScreenHeader title="Choisir les tâches" />)

    expect(screen.getByRole('heading', { level: 1, name: 'Choisir les tâches' })).toBeInTheDocument()
  })

  it('offers the theme toggle', () => {
    render(<ScreenHeader title="Session terminée" size="lg" />)

    expect(screen.getByRole('button', { name: /Passer en thème/ })).toBeInTheDocument()
  })
})
