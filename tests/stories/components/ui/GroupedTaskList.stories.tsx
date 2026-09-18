import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/components/ui/Button'
import { GroupedTaskList } from '@/components/ui/GroupedTaskList'
import { sampleTasks } from '@/fixtures/tasks'

const rooms = [
  { id: 'salon', name: 'Salon' },
  { id: 'cuisine', name: 'Cuisine' },
  { id: 'salle-de-bain', name: 'Salle de bain' },
]

const meta = {
  title: 'UI/GroupedTaskList',
  component: GroupedTaskList,
  tags: ['autodocs'],
  args: {
    tasks: sampleTasks,
    rooms,
    renderRow: (task) => (
      <button type="button" className="block w-full py-3 text-left font-medium text-foreground">
        {task.name}
      </button>
    ),
  },
  argTypes: { renderRow: { control: false } },
  decorators: [
    (Story) => (
      <div className="bg-background p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GroupedTaskList>

export default meta
type Story = StoryObj<typeof meta>

/** Plain tappable rows, as in Configuration and the chrono task picker. */
export const Default: Story = {}

/** Rows with details and an inline action, as in the Génération selection step. */
export const WithRowActions: Story = {
  args: {
    rowClassName: 'flex items-center gap-4 py-3',
    renderRow: (task) => (
      <>
        <span className="flex-1">
          <span className="block font-medium text-foreground">{task.name}</span>
          <span className="block text-sm text-muted-foreground">
            Durée : {task.expectedDuration ?? '?'} min
          </span>
        </span>
        <Button size="sm" variant="secondary">
          Sélectionner
        </Button>
      </>
    ),
  },
}

/** No tasks: nothing is rendered, the screen shows its own empty state. */
export const Empty: Story = { args: { tasks: [] } }
