import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { sampleTasks } from '@/fixtures/tasks'
import { ExecutionScreen } from '@/components/ExecutionScreen'

const meta = {
  title: 'Exécution/ExecutionScreen',
  component: ExecutionScreen,
  args: {
    task: sampleTasks[3],
    status: 'idle',
    menuOpen: false,
    position: 1,
    total: sampleTasks.length,
    onToggle: fn(),
    onNext: fn(),
    onOpenMenu: fn(),
    onCloseMenu: fn(),
    onFinish: fn(),
  },
} satisfies Meta<typeof ExecutionScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Idle: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Démarrer' }))
    await expect(args.onToggle).toHaveBeenCalledOnce()
  },
}

export const Running: Story = {
  args: { status: 'running' },
}

export const Paused: Story = {
  args: { status: 'paused' },
}

export const MenuOpen: Story = {
  args: { status: 'running', menuOpen: true },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Terminer' }))
    await expect(args.onFinish).toHaveBeenCalledOnce()
  },
}

export const LastTask: Story = {
  args: { position: sampleTasks.length, task: sampleTasks.at(-1)! },
}

export const LongName: Story = {
  args: {
    task: {
      ...sampleTasks[0],
      name: 'Nettoyer la salle de bain à fond, y compris les joints du carrelage',
    },
  },
}
