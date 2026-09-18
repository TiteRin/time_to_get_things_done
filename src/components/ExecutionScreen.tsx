import type { ReactNode } from 'react'
import type { SessionStatus } from '@/domain/session'
import type { Task } from '@/domain/task'
import { StatusHint } from '@/components/ui/StatusHint'
import { TapToggle } from '@/components/ui/TapToggle'
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
      className="relative grid h-dvh w-full touch-none grid-rows-[20%_1fr_20%] overflow-hidden bg-background text-foreground select-none"
      {...(menuOpen ? {} : swipeHandlers)}
    >
      <button
        type="button"
        aria-label="Afficher le menu"
        onClick={onOpenMenu}
        className="flex flex-col items-center justify-start gap-1 pt-[max(1rem,env(safe-area-inset-top))] text-muted-foreground active:bg-surface/50"
      >
        <span className="text-sm tabular-nums">
          {position} / {total}
        </span>
        <span aria-hidden="true" className="text-lg leading-none">
          ⌄
        </span>
      </button>

      <div className="relative flex flex-col items-center justify-center gap-6 px-6 text-center">
        <TapToggle status={status} onToggle={onToggle} />
        <h1
          className={`pointer-events-none relative text-4xl font-bold text-balance transition-opacity ${
            status === 'paused' ? 'opacity-50' : ''
          }`}
        >
          {task.name}
        </h1>
        <StatusHint status={status} />
      </div>

      <button
        type="button"
        aria-label="Tâche suivante"
        onClick={onNext}
        className="flex flex-col items-center justify-end gap-1 pb-[max(1rem,env(safe-area-inset-bottom))] text-muted-foreground active:bg-surface/50"
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
