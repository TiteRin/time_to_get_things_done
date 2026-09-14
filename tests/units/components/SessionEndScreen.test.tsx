import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { TimelineEntry } from '@/domain/session'
import type { Task } from '@/domain/task'
import { SessionEndScreen } from '@/components/SessionEndScreen'

const tasks: Task[] = [
  { id: 'a', name: 'Faire la vaisselle', expectedDuration: 15, perceivedDifficulty: 'medium' },
  { id: 'b', name: 'Faire les litières', expectedDuration: 5, perceivedDifficulty: 'easy' },
]

describe('SessionEndScreen', () => {
  it('lists the timeline with elapsed time since the first action', () => {
    const timeline: TimelineEntry[] = [
      { type: 'start', taskIndex: 0, at: 10_000 },
      { type: 'pause', taskIndex: 0, at: 70_000 },
      { type: 'resume', taskIndex: 0, at: 75_000 },
      { type: 'complete', taskIndex: 0, at: 610_000 },
      { type: 'finish', taskIndex: 1, at: 4_210_000 },
    ]

    render(<SessionEndScreen tasks={tasks} timeline={timeline} />)

    expect(screen.getByRole('heading', { name: 'Session terminée' })).toBeInTheDocument()
    const items = within(screen.getByRole('list', { name: 'Timeline' }))
      .getAllByRole('listitem')
      .map((item) => item.textContent)
    expect(items).toEqual([
      '00:00Démarrer · Faire la vaisselle',
      '01:00Pause · Faire la vaisselle',
      '01:05Reprise · Faire la vaisselle',
      '10:00Tâche faite · Faire la vaisselle',
      '70:00Session terminée · Faire les litières',
    ])
  })

  it('says so when nothing was recorded', () => {
    render(<SessionEndScreen tasks={tasks} timeline={[]} />)

    expect(screen.getByText('Aucune action enregistrée.')).toBeInTheDocument()
  })
})
