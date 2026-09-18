import { Component, type ReactNode } from 'react'

/** Catches unexpected rendering errors and shows a French fallback message */
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (!this.state.failed) return this.props.children

    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background p-6 text-center">
        <h1 className="text-xl font-semibold text-foreground">Une erreur est survenue</h1>
        <p className="text-muted-foreground">Recharge la page pour reprendre.</p>
      </main>
    )
  }
}
