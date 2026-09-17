import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { ChronoScreen } from '@/components/ChronoScreen'

const task = { id: 'a', name: 'Faire la vaisselle' }

const meta = {
  title: 'Chrono/ChronoScreen',
  component: ChronoScreen,
  args: { task, onToggle: fn(), onFinish: fn(), onCancel: fn() },
} satisfies Meta<typeof ChronoScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Idle: Story = {
  args: { status: 'idle', elapsedMs: 0 },
}

export const Running: Story = {
  args: { status: 'running', elapsedMs: 65_000 },
}

export const Paused: Story = {
  args: { status: 'paused', elapsedMs: 125_000 },
}
