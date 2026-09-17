import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { HomeScreen } from '@/components/HomeScreen'

describe('HomeScreen', () => {
  it('offers to generate a list or time a task, and renders extra navigation', async () => {
    const onGenerate = vi.fn()
    const onChrono = vi.fn()
    render(
      <HomeScreen
        onGenerate={onGenerate}
        onChrono={onChrono}
        footerExtra={<a href="/configuration">Configuration</a>}
      />,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Générer une liste' }))
    expect(onGenerate).toHaveBeenCalledOnce()

    await userEvent.click(screen.getByRole('button', { name: 'Chronométrer une tâche' }))
    expect(onChrono).toHaveBeenCalledOnce()

    expect(screen.getByRole('link', { name: 'Configuration' })).toBeInTheDocument()
  })
})
