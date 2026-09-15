import type { Meta, StoryObj } from '@storybook/react-vite'
import { useArgs } from 'storybook/preview-api'
import { fn } from 'storybook/test'
import { RoomSelect } from '@/components/RoomSelect'

const rooms = [
  { id: 'salon', name: 'Salon' },
  { id: 'cuisine', name: 'Cuisine' },
  { id: 'salle-de-bain', name: 'Salle de bain' },
]

const meta = {
  title: 'Configuration/RoomSelect',
  component: RoomSelect,
  args: { rooms, onChange: fn(), onAddRoom: fn() },
  decorators: [
    (Story) => (
      <div className="min-h-dvh bg-slate-900 p-6">
        <Story />
      </div>
    ),
  ],
  render: function Render(args) {
    const [, updateArgs] = useArgs()
    return (
      <RoomSelect
        {...args}
        onChange={(value) => {
          args.onChange(value)
          updateArgs({ value })
        }}
      />
    )
  },
} satisfies Meta<typeof RoomSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {}

export const Selected: Story = {
  args: { value: 'cuisine' },
}
