import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { ThemeToggle } from '@/components/ThemeToggle'
import { ActionOverlay } from '@/components/ui/ActionOverlay'

const meta = {
  title: 'UI/ActionOverlay',
  component: ActionOverlay,
  tags: ['autodocs'],
  argTypes: {
    align: { control: 'inline-radio', options: ['top', 'center'] },
    corner: { control: false },
    children: { control: false },
  },
  // The overlay covers its positioned parent; a fake screen shows it is translucent
  decorators: [
    (Story) => (
      <div className="relative flex h-[32rem] items-center justify-center bg-background text-4xl font-bold text-foreground">
        Faire la vaisselle
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ActionOverlay>

export default meta
type Story = StoryObj<typeof meta>

/** A confirmation: centered question, the safe choice last (closest to the thumb). */
export const Confirmation: Story = {
  args: {
    label: "Confirmer l'abandon",
    message: 'Abandonner ce chronométrage ?',
    actions: [
      { label: 'Abandonner', variant: 'secondary', onClick: fn() },
      { label: 'Continuer', onClick: fn() },
    ],
  },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Continuer' }))
    await expect(args.actions[1].onClick).toHaveBeenCalledOnce()
  },
}

/** A menu dropping from the top, with a corner control and a link below the actions. */
export const Menu: Story = {
  args: {
    label: 'Menu de la session',
    align: 'top',
    actions: [
      { label: 'Terminer', onClick: fn() },
      { label: 'Annuler', variant: 'secondary', onClick: fn() },
    ],
    corner: <ThemeToggle />,
    children: (
      <a href="#" className="text-accent-secondary underline">
        Configuration
      </a>
    ),
  },
}
