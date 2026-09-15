import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { DebriefingScreen } from '@/components/DebriefingScreen'
import type { TimelineEntry } from '@/domain/session'
import type { Task } from '@/domain/task'

const BASE = new Date('2026-09-15T10:00:00').getTime()
const at = (type: TimelineEntry['type'], taskIndex: number, seconds: number): TimelineEntry => ({
  type,
  taskIndex,
  at: BASE + seconds * 1000,
})

const tasks: Task[] = [
  { id: 'a', name: 'Faire la vaisselle', expectedDuration: 15, perceivedDifficulty: 'medium' },
  { id: 'b', name: 'Nettoyer les fontaines', expectedDuration: 5 },
  { id: 'c', name: 'Faire les litières' },
]

const meta = {
  title: 'Débriefing/DebriefingScreen',
  component: DebriefingScreen,
  args: { tasks, timeline: [], onUpdateTask: fn(), onClose: fn() },
} satisfies Meta<typeof DebriefingScreen>

export default meta
type Story = StoryObj<typeof meta>

const timelineOf = (canvasElement: HTMLElement) =>
  within(within(canvasElement).getByRole('list', { name: 'Timeline' }))

/** Every task completed, with a pause and a wait between tasks */
export const Completed: Story = {
  args: {
    timeline: [
      at('start', 0, 0),
      at('pause', 0, 240),
      at('resume', 0, 360),
      at('complete', 0, 600),
      at('start', 1, 630),
      at('complete', 1, 900),
      at('start', 2, 900),
      at('complete', 2, 1200),
    ],
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { name: 'Bravo !' })).toBeInTheDocument()

    const timeline = timelineOf(canvasElement)
    await expect(timeline.getAllByRole('button', { name: 'Faire la vaisselle' })).toHaveLength(2)
    await expect(timeline.getByText('Pause')).toBeInTheDocument()
    await expect(timeline.getByText('Attente')).toBeInTheDocument()

    await expect(
      canvas.getByText('3 tâches effectuées sur 3, temps passé : 20 minutes'),
    ).toBeInTheDocument()

    await userEvent.click(timeline.getByRole('button', { name: 'Nettoyer les fontaines' }))
    const sheet = canvas.getByRole('dialog', { name: 'Nettoyer les fontaines' })
    await expect(sheet).toHaveTextContent('Durée effective4 min 30 s')
    await userEvent.click(within(sheet).getByRole('button', { name: 'Fermer le détail' }))
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: 'Fermer' }))
    await expect(args.onClose).toHaveBeenCalled()
  },
}

/** Ended through "Terminer" while the second task was running */
export const FinishedMidTask: Story = {
  args: {
    timeline: [
      at('start', 0, 0),
      at('complete', 0, 300),
      at('start', 1, 310),
      at('finish', 1, 400),
    ],
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('1 tâche effectuée sur 3, temps passé : 7 minutes'),
    ).toBeInTheDocument()
  },
}

/** The second task was swiped away without ever being started */
export const SkippedTask: Story = {
  args: {
    timeline: [at('start', 0, 0), at('complete', 0, 300), at('complete', 1, 320)],
  },
  play: async ({ canvasElement }) => {
    const timeline = timelineOf(canvasElement)
    await expect(timeline.queryByRole('button', { name: 'Nettoyer les fontaines' })).toBeNull()
    await expect(timeline.getByText('Attente')).toBeInTheDocument()
    await expect(
      within(canvasElement).getByText('1 tâche effectuée sur 3, temps passé : 5 minutes'),
    ).toBeInTheDocument()
  },
}

/** Every task was skipped: nothing was started */
export const NoTaskStarted: Story = {
  args: {
    timeline: [at('complete', 0, 0), at('complete', 1, 20), at('complete', 2, 40)],
  },
  play: async ({ canvasElement }) => {
    const timeline = timelineOf(canvasElement)
    await expect(timeline.queryAllByRole('button')).toHaveLength(0)
    await expect(
      within(canvasElement).getByText('0 tâche effectuée sur 3, temps passé : 1 minute'),
    ).toBeInTheDocument()
  },
}

/** "Terminer" before the first tap: no event at all */
export const Empty: Story = {
  args: { timeline: [at('finish', 0, 0)] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Aucune tâche démarrée.')).toBeInTheDocument()
    await expect(
      canvas.getByText('0 tâche effectuée sur 3, temps passé : 0 minute'),
    ).toBeInTheDocument()
  },
}
