import type { Meta, StoryObj } from '@storybook/react-vite'
import { TaskList } from '@/components/TaskList'

const rooms = [
  { id: 'salon', name: 'Salon' },
  { id: 'cuisine', name: 'Cuisine' },
]

const meta = {
  title: 'Configuration/TaskList',
  component: TaskList,
  args: { rooms },
  decorators: [
    (Story) => (
      <div className="min-h-dvh bg-slate-900 p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TaskList>

export default meta
type Story = StoryObj<typeof meta>

export const Filled: Story = {
  args: {
    tasks: [
      { id: 't1', name: 'Épousseter', roomId: 'salon' },
      { id: 't2', name: 'Aspirer' },
      { id: 't3', name: 'Passer le balai', roomId: 'cuisine' },
      { id: 't4', name: 'Passer le balai', roomId: 'salon' },
    ],
  },
}

export const Empty: Story = {
  args: { tasks: [] },
}
