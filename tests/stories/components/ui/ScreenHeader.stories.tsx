import type { Meta, StoryObj } from '@storybook/react-vite'
import { ScreenHeader } from '@/components/ui/ScreenHeader'

const meta = {
  title: 'UI/ScreenHeader',
  component: ScreenHeader,
  tags: ['autodocs'],
  args: { title: 'Choisir les tâches' },
  argTypes: { size: { control: 'inline-radio', options: ['md', 'lg'] } },
  decorators: [
    (Story) => (
      <div className="bg-background p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScreenHeader>

export default meta
type Story = StoryObj<typeof meta>

/** Header of the working screens (Génération, choix de tâche, recalibrage du chrono). */
export const Medium: Story = {}

/** Header of a closing screen (fin de session). */
export const Large: Story = { args: { size: 'lg', title: 'Session terminée' } }

/** Long titles wrap instead of pushing the theme toggle off screen. */
export const LongTitle: Story = {
  args: { title: 'Mettre à jour « Nettoyer le plan de travail et l’évier » ?' },
}
