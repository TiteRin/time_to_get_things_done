import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { TaskPicker } from '@/components/TaskPicker'
import { sampleTasks } from '@/fixtures/tasks'

const rooms = [
  { id: 'salon', name: 'Salon' },
  { id: 'cuisine', name: 'Cuisine' },
  { id: 'toilettes', name: 'Toilettes' },
  { id: 'salle-de-bain', name: 'Salle de bain' },
]

const meta = {
  title: 'Chrono/TaskPicker',
  component: TaskPicker,
  args: { tasks: sampleTasks, rooms, onSelect: fn() },
} satisfies Meta<typeof TaskPicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    footerExtra: (
      <a href="/" className="font-medium text-accent-secondary">
        Annuler
      </a>
    ),
  },
}
