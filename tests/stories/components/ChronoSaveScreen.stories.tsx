import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { ChronoSaveScreen } from '@/components/ChronoSaveScreen'

const meta = {
  title: 'Chrono/ChronoSaveScreen',
  component: ChronoSaveScreen,
  args: { onReplace: fn(), onSkip: fn() },
} satisfies Meta<typeof ChronoSaveScreen>

export default meta
type Story = StoryObj<typeof meta>

export const WithPlannedDuration: Story = {
  args: {
    task: {
      id: 'a',
      name: 'Faire la vaisselle',
      expectedDuration: 15,
      perceivedDifficulty: 'medium',
    },
    totalMs: 22 * 60_000,
    actualMs: 18 * 60_000,
  },
}

export const WithoutPlannedDuration: Story = {
  args: {
    task: { id: 'b', name: 'Ranger le salon' },
    totalMs: 8 * 60_000,
    actualMs: 6 * 60_000,
  },
}

export const NothingTimed: Story = {
  args: {
    task: { id: 'c', name: 'Faire les litières', expectedDuration: 5 },
    totalMs: 0,
    actualMs: 0,
  },
}
