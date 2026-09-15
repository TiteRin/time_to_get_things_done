import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ErrorBoundary } from '@/components/ErrorBoundary'

function Broken(): never {
  throw new Error('boom')
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // React logs the caught error; keep the test output clean
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('renders its children when nothing fails', () => {
    render(
      <ErrorBoundary>
        <p>Tout va bien</p>
      </ErrorBoundary>,
    )

    expect(screen.getByText('Tout va bien')).toBeInTheDocument()
  })

  it('shows a French message when a child throws', () => {
    render(
      <ErrorBoundary>
        <Broken />
      </ErrorBoundary>,
    )

    expect(screen.getByRole('heading', { name: 'Une erreur est survenue' })).toBeInTheDocument()
    expect(screen.queryByText('boom')).not.toBeInTheDocument()
  })
})
