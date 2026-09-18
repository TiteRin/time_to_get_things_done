import { useReducer } from 'react'
import { createSession, sessionReducer, type SessionState } from '@/domain/session'
import type { Task } from '@/domain/task'

export type SessionControls = {
  state: SessionState
  currentTask: Task | undefined
  toggle: () => void
  next: () => void
  openMenu: () => void
  closeMenu: () => void
  finish: () => void
  restart: () => void
}

const TOGGLE_EVENT = { idle: 'START', running: 'PAUSE', paused: 'RESUME' } as const

export function useSession(tasks: Task[], now: () => number = Date.now): SessionControls {
  const [state, dispatch] = useReducer(sessionReducer, tasks, createSession)

  return {
    state,
    currentTask: state.tasks[state.currentIndex],
    toggle: () => {
      if (state.status === 'ended') return
      dispatch({ type: TOGGLE_EVENT[state.status], at: now() })
    },
    next: () => dispatch({ type: 'NEXT', at: now() }),
    openMenu: () => dispatch({ type: 'OPEN_MENU' }),
    closeMenu: () => dispatch({ type: 'CLOSE_MENU' }),
    finish: () => dispatch({ type: 'FINISH', at: now() }),
    restart: () => dispatch({ type: 'RESTART' }),
  }
}
