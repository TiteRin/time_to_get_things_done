export function TopMenu({ onCancel, onFinish }: { onCancel: () => void; onFinish: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menu de la session"
      className="absolute inset-0 flex flex-col justify-start gap-4 bg-slate-950/90 p-6 pt-[max(1.5rem,env(safe-area-inset-top))] backdrop-blur-sm"
    >
      <button
        type="button"
        onClick={onFinish}
        className="rounded-2xl bg-emerald-500 px-6 py-5 text-xl font-semibold text-slate-950 active:bg-emerald-400"
      >
        Terminer
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="rounded-2xl border border-slate-600 px-6 py-5 text-xl font-semibold text-slate-100 active:bg-slate-800"
      >
        Annuler
      </button>
    </div>
  )
}
