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
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-slate-900 p-6 text-center">
        <h1 className="text-xl font-semibold text-slate-100">Une erreur est survenue</h1>
        <p className="text-slate-400">Recharge la page pour reprendre.</p>
      </main>
    )
  }
}
