import type { Meta, StoryObj } from '@storybook/react-vite'
import { sampleTasks } from '@/fixtures/tasks'
import { SessionEndScreen } from '@/components/SessionEndScreen'

const meta = {
  title: 'Exécution/SessionEndScreen',
  component: SessionEndScreen,
  args: { tasks: sampleTasks, timeline: [] },
} satisfies Meta<typeof SessionEndScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Completed: Story = {
  args: {
    timeline: [
      { type: 'start', taskIndex: 0, at: 0 },
      { type: 'complete', taskIndex: 0, at: 240_000 },
      { type: 'start', taskIndex: 1, at: 250_000 },
      { type: 'pause', taskIndex: 1, at: 400_000 },
      { type: 'resume', taskIndex: 1, at: 520_000 },
      { type: 'complete', taskIndex: 1, at: 700_000 },
      { type: 'start', taskIndex: 2, at: 710_000 },
      { type: 'finish', taskIndex: 2, at: 1_300_000 },
    ],
  },
}

export const Empty: Story = {}
