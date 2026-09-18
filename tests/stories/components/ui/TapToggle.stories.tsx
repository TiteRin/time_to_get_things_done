import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { TapToggle } from '@/components/ui/TapToggle'

const meta = {
  title: 'UI/TapToggle',
  component: TapToggle,
  tags: ['autodocs'],
  args: { status: 'idle', onToggle: fn() },
  argTypes: { status: { control: 'inline-radio', options: ['idle', 'running', 'paused'] } },
  // A positioned, bordered box stands in for the screen area the toggle covers
  decorators: [
    (Story) => (
      <div className="bg-background p-6">
        <div className="relative flex h-48 items-center justify-center rounded-xl border border-dashed border-border text-muted-foreground">
          <span className="pointer-events-none relative">Toute la zone est cliquable</span>
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof TapToggle>

export default meta
type Story = StoryObj<typeof meta>

/** Before the first tap: announced as "Démarrer". */
export const Idle: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Démarrer' }))
    await expect(args.onToggle).toHaveBeenCalledOnce()
  },
}

/** While the timer runs: announced as "Pause". */
export const Running: Story = { args: { status: 'running' } }

/** While paused: announced as "Reprendre". */
export const Paused: Story = { args: { status: 'paused' } }
