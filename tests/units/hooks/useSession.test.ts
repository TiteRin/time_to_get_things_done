import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Task } from '@/domain/task'
import { useSession } from '@/hooks/useSession'

const tasks: Task[] = [
  { id: 'a', name: 'Faire la vaisselle', expectedDuration: 15, perceivedDifficulty: 'medium' },
  { id: 'b', name: 'Faire les litières', expectedDuration: 5, perceivedDifficulty: 'easy' },
]

function setup() {
  let time = 0
  const clock = {
    now: () => time,
    set: (value: number) => {
      time = value
    },
  }
  const hook = renderHook(() => useSession(tasks, clock.now))
  return { clock, hook }
}

describe('useSession', () => {
  it('exposes the current task', () => {
    const { hook } = setup()

    expect(hook.result.current.currentTask).toEqual(tasks[0])
    expect(hook.result.current.state.status).toBe('idle')
  })

  it('toggle cycles start → pause → resume using the injected clock', () => {
    const { clock, hook } = setup()

    clock.set(1000)
    act(() => hook.result.current.toggle())
    clock.set(2000)
    act(() => hook.result.current.toggle())
    clock.set(3000)
    act(() => hook.result.current.toggle())

    expect(hook.result.current.state.status).toBe('running')
    expect(hook.result.current.state.timeline).toEqual([
      { type: 'start', taskIndex: 0, at: 1000 },
      { type: 'pause', taskIndex: 0, at: 2000 },
      { type: 'resume', taskIndex: 0, at: 3000 },
    ])
  })

  it('next moves to the following task', () => {
    const { clock, hook } = setup()

    clock.set(500)
    act(() => hook.result.current.next())

    expect(hook.result.current.currentTask).toEqual(tasks[1])
    expect(hook.result.current.state.timeline).toEqual([
      { type: 'complete', taskIndex: 0, at: 500 },
    ])
  })

  it('opens the menu, closes it and finishes the session', () => {
    const { clock, hook } = setup()

    act(() => hook.result.current.openMenu())
    expect(hook.result.current.state.menuOpen).toBe(true)

    act(() => hook.result.current.closeMenu())
    expect(hook.result.current.state.menuOpen).toBe(false)

    clock.set(4000)
    act(() => hook.result.current.finish())
    expect(hook.result.current.state.status).toBe('ended')
    expect(hook.result.current.state.timeline).toEqual([{ type: 'finish', taskIndex: 0, at: 4000 }])
  })
})
