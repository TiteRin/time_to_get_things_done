import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Button } from '@/components/ui/Button'
import { TaskItem } from '@/components/ui/TaskItem'

const meta = {
  title: 'UI/TaskItem',
  component: TaskItem,
  tags: ['autodocs'],
  args: { name: 'Faire la vaisselle' },
  argTypes: {
    details: { control: 'text' },
    leading: { control: false },
    trailing: { control: false },
  },
  // Same frame as in the app: a divided list
  decorators: [
    (Story) => (
      <div className="bg-background p-6">
        <ul className="flex flex-col divide-y divide-border">
          <li>
            <Story />
          </li>
        </ul>
      </div>
    ),
  ],
} satisfies Meta<typeof TaskItem>

export default meta
type Story = StoryObj<typeof meta>

/** The whole row is a button (Configuration, chrono task picker). */
export const Tappable: Story = {
  args: { onClick: fn(), ariaLabel: 'Chronométrer Faire la vaisselle' },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Chronométrer Faire la vaisselle' }),
    )
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}

/** Name with its details line, read-only. */
export const WithDetails: Story = {
  args: { details: 'Durée : 15 min · Difficulté : Moyen · Matériel : Éponge' },
}

/** A task picked in the Génération selection step: highlighted name, pressed action. */
export const SelectedWithAction: Story = {
  args: {
    selected: true,
    details: 'Durée : 15 min · Difficulté : Moyen',
    detailsId: 'details-vaisselle',
    trailing: (
      <Button size="sm" aria-pressed aria-describedby="details-vaisselle">
        Désélectionner
      </Button>
    ),
  },
}

/** A task in the Génération ordering step: drag handle before, remove action after. */
export const Reorderable: Story = {
  args: {
    details: 'Cuisine',
    leading: (
      <button
        type="button"
        aria-label="Déplacer Faire la vaisselle"
        className="cursor-grab px-1 text-lg text-muted-foreground"
      >
        ⠿
      </button>
    ),
    trailing: (
      <Button size="sm" variant="secondary">
        Retirer
      </Button>
    ),
  },
}

/** Long names wrap; the trailing action keeps its size. */
export const LongName: Story = {
  args: {
    name: 'Nettoyer le plan de travail, l’évier et la plaque de cuisson',
    details: 'Cuisine',
    trailing: (
      <Button size="sm" variant="secondary">
        Sélectionner
      </Button>
    ),
  },
}
