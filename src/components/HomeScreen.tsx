import type { ReactNode } from 'react'

export function HomeScreen({
  onGenerate,
  onChrono,
  footerExtra,
}: {
  onGenerate: () => void
  onChrono: () => void
  /** Extra navigation rendered under the two actions (e.g. a Configuration link) */
  footerExtra?: ReactNode
}) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-10 bg-slate-900 p-6 text-center">
      <h1 className="text-2xl font-bold text-slate-100">Time To Get Things Done</h1>
      <div className="flex w-full max-w-sm flex-col gap-4">
        <button
          type="button"
          onClick={onGenerate}
          className="rounded-xl bg-emerald-500 py-4 text-lg font-medium text-slate-950"
        >
          Générer une liste
        </button>
        <button
          type="button"
          onClick={onChrono}
          className="rounded-xl border border-slate-600 py-4 text-lg font-medium text-slate-100"
        >
          Chronométrer une tâche
        </button>
      </div>
      {footerExtra}
    </main>
  )
}
