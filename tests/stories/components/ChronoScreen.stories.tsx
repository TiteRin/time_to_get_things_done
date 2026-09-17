import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Not started yet: no Terminer button
    await expect(canvas.queryByRole('button', { name: 'Terminer' })).not.toBeInTheDocument()
  },
}

export const Running: Story = {
  args: { status: 'running', elapsedMs: 65_234 },
}

export const Paused: Story = {
  args: { status: 'paused', elapsedMs: 125_678 },
}

export const ConfirmingCancel: Story = {
  args: { status: 'running', elapsedMs: 65_234 },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Annuler' }))
    await expect(canvas.getByText('Abandonner ce chronométrage ?')).toBeInTheDocument()
    await expect(args.onCancel).not.toHaveBeenCalled()
  },
}
