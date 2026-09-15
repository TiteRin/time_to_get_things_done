import type { ReactNode } from 'react'
import type { SessionStatus } from '@/domain/session'
import type { Task } from '@/domain/task'
import { TopMenu } from './TopMenu'
import { useSwipe } from '@/hooks/useSwipe'

export type ExecutionScreenProps = {
  task: Task
  status: Exclude<SessionStatus, 'ended'>
  menuOpen: boolean
  /** 1-based position of the task in the session */
  position: number
  total: number
  onToggle: () => void
  onNext: () => void
  onOpenMenu: () => void
  onCloseMenu: () => void
  onFinish: () => void
  /** Extra actions shown at the bottom of the top menu */
  menuExtra?: ReactNode
}

const CENTER_LABEL = { idle: 'Démarrer', running: 'Pause', paused: 'Reprendre' } as const
const STATUS_HINT = {
  idle: 'Touchez pour commencer',
  running: 'En cours',
  paused: 'En pause',
} as const

export function ExecutionScreen({
  task,
  status,
  menuOpen,
  position,
  total,
  onToggle,
  onNext,
  onOpenMenu,
  onCloseMenu,
  onFinish,
  menuExtra,
}: ExecutionScreenProps) {
  const swipeHandlers = useSwipe({ onSwipeUp: onNext })
  const isLast = position === total

  return (
    <main
      className="relative grid h-dvh w-full touch-none grid-rows-[20%_1fr_20%] overflow-hidden bg-slate-900 text-slate-50 select-none"
      {...(menuOpen ? {} : swipeHandlers)}
    >
      <button
        type="button"
        aria-label="Afficher le menu"
        onClick={onOpenMenu}
        className="flex flex-col items-center justify-start gap-1 pt-[max(1rem,env(safe-area-inset-top))] text-slate-400 active:bg-slate-800/50"
      >
        <span className="text-sm tabular-nums">
          {position} / {total}
        </span>
        <span aria-hidden="true" className="text-lg leading-none">
          ⌄
        </span>
      </button>

      <div className="relative flex flex-col items-center justify-center gap-6 px-6 text-center">
        <button
          type="button"
          aria-label={CENTER_LABEL[status]}
          onClick={onToggle}
          className="absolute inset-0 active:bg-slate-800/30"
        />
        <h1
          className={`pointer-events-none relative text-4xl font-bold text-balance transition-opacity ${
            status === 'paused' ? 'opacity-50' : ''
          }`}
        >
          {task.name}
        </h1>
        <p className="pointer-events-none relative flex items-center gap-2 text-slate-400">
          {status === 'running' && (
            <span aria-hidden="true" className="size-2 animate-pulse rounded-full bg-emerald-400" />
          )}
          {STATUS_HINT[status]}
        </p>
      </div>

      <button
        type="button"
        aria-label="Tâche suivante"
        onClick={onNext}
        className="flex flex-col items-center justify-end gap-1 pb-[max(1rem,env(safe-area-inset-bottom))] text-slate-400 active:bg-slate-800/50"
      >
        <span aria-hidden="true" className="text-lg leading-none">
          ⌃
        </span>
        <span className="text-sm">{isLast ? 'Dernière tâche' : 'Tâche suivante'}</span>
      </button>

      {menuOpen && (
        <TopMenu onCancel={onCloseMenu} onFinish={onFinish}>
          {menuExtra}
        </TopMenu>
      )}
    </main>
  )
}
