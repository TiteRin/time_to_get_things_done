import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { TaskForm } from '@/components/TaskForm'

const rooms = [
  { id: 'salon', name: 'Salon' },
  { id: 'cuisine', name: 'Cuisine' },
  { id: 'salle-de-bain', name: 'Salle de bain' },
]

const equipment = [
  { id: 'balai', name: 'Balai' },
  { id: 'aspirateur', name: 'Aspirateur' },
  { id: 'chiffon', name: 'Chiffon' },
]

const meta = {
  title: 'Configuration/TaskForm',
  component: TaskForm,
  args: {
    rooms,
    equipment,
    onSubmit: fn(),
    onAddRoom: fn(async (name: string) => ({ id: crypto.randomUUID(), name })),
    onAddEquipment: fn(async (name: string) => ({ id: crypto.randomUUID(), name })),
  },
  decorators: [
    (Story) => (
      <div className="min-h-dvh bg-background p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TaskForm>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {}

export const EditingTask: Story = {
  args: {
    task: {
      id: 't1',
      name: 'Passer le balai',
      expectedDuration: 15,
      perceivedDifficulty: 'easy',
      roomId: 'cuisine',
      equipmentIds: ['balai'],
    },
  },
}

export const WithValidationError: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Enregistrer' }))
    await expect(canvas.getByRole('alert')).toHaveTextContent('Le nom de la tâche est obligatoire')
  },
}
