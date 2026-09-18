import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Button } from '@/components/ui/Button'

const meta = {
  title: 'UI/Button',
  component: Button,
  args: { children: 'Démarrer', onClick: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-dvh flex-col gap-4 bg-background p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Démarrer' }))
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Étape précédente' },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Démarrer' }))
    await expect(args.onClick).not.toHaveBeenCalled()
  },
}

export const Small: Story = {
  args: { size: 'sm', children: 'Sélectionner' },
  decorators: [
    (Story) => (
      <div className="self-start">
        <Story />
      </div>
    ),
  ],
}

export const Large: Story = {
  args: { size: 'lg', children: 'Terminer' },
}

/** Every variant × size, for a side-by-side check in both themes */
export const AllVariants: Story = {
  render: (args) => (
    <>
      {(['lg', 'md', 'sm'] as const).map((size) => (
        <div key={size} className="flex items-start gap-3">
          <Button {...args} size={size} variant="primary">
            Principal {size}
          </Button>
          <Button {...args} size={size} variant="secondary">
            Secondaire {size}
          </Button>
          <Button {...args} size={size} disabled>
            Désactivé
          </Button>
        </div>
      ))}
    </>
  ),
}
