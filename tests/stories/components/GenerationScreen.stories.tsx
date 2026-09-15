import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { GenerationScreen } from '@/components/GenerationScreen'
import { sampleTasks } from '@/fixtures/tasks'

const rooms = [
  { id: 'salon', name: 'Salon' },
  { id: 'cuisine', name: 'Cuisine' },
  { id: 'toilettes', name: 'Toilettes' },
  { id: 'salle-de-bain', name: 'Salle de bain' },
]

const meta = {
  title: 'Génération/GenerationScreen',
  component: GenerationScreen,
  args: {
    tasks: sampleTasks,
    rooms,
    equipment: [],
    selected: [sampleTasks[3], sampleTasks[0], sampleTasks[5]],
    onToggle: fn(),
    onRemove: fn(),
    onReorder: fn(),
    onNextStep: fn(),
    onPreviousStep: fn(),
    onStart: fn(),
  },
} satisfies Meta<typeof GenerationScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Selection: Story = {
  args: { step: 'select' },
}

export const SelectionVide: Story = {
  args: { step: 'select', selected: [] },
}

export const Ordonnancement: Story = {
  args: { step: 'order' },
}

/**
 * Catalogue de premier lancement : les tâches n'ont qu'un nom.
 * Durée et difficulté restent affichées avec leur libellé « non renseignée ».
 */
export const SansInformations: Story = {
  args: {
    step: 'select',
    selected: [],
    tasks: [
      { id: 'n1', name: 'Faire les poussières', roomId: 'salon' },
      { id: 'n2', name: 'Faire la vaisselle', roomId: 'cuisine' },
      { id: 'n3', name: 'Aspirer' },
    ],
  },
}

/** Long catalogue: the summary and buttons must stay visible while scrolling */
export const CatalogueLong: Story = {
  args: {
    step: 'select',
    selected: [],
    tasks: Array.from({ length: 30 }, (_, i) => ({
      id: `extra-${i}`,
      name: `Tâche numéro ${i + 1}`,
      expectedDuration: 5,
    })),
  },
}
