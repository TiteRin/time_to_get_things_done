import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Button } from '@/components/ui/Button'
import { uiStoryDecorator } from '../../../helpers/uiStory'

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Démarrer', onClick: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    children: { control: 'text' },
  },
  decorators: [uiStoryDecorator],
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/** The main action of a screen: Démarrer, Enregistrer, Terminer… */
export const Primary: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Démarrer' }))
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}

/** Alternatives and cancellations, next to a primary button. */
export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Étape précédente' },
}

/** Dimmed and inert, e.g. Démarrer while no task is selected. */
export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Démarrer' }))
    await expect(args.onClick).not.toHaveBeenCalled()
  },
}

/** Inline action on a list row (Sélectionner, Retirer). */
export const Small: Story = {
  args: { size: 'sm', children: 'Sélectionner' },
}

/** Big tap target for immersive screens (Exécution menu, Chrono). Usually full width. */
export const Large: Story = {
  args: { size: 'lg', children: 'Terminer', className: 'w-full' },
}

/** Every variant × size, to compare them side by side in both themes. */
export const AllVariants: Story = {
  render: (args) => (
    <>
      {(['lg', 'md', 'sm'] as const).map((size) => (
        <div key={size} className="flex flex-wrap items-start gap-3">
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
