import type { Meta, StoryObj } from '@storybook/react-vite'
import { useArgs } from 'storybook/preview-api'
import { fn } from 'storybook/test'
import { EquipmentTagInput } from '@/components/EquipmentTagInput'

const equipment = [
  { id: 'balai', name: 'Balai' },
  { id: 'aspirateur', name: 'Aspirateur' },
  { id: 'chiffon', name: 'Chiffon' },
]

const meta = {
  title: 'Configuration/EquipmentTagInput',
  component: EquipmentTagInput,
  args: { equipment, value: [], onChange: fn(), onAddEquipment: fn() },
  decorators: [
    (Story) => (
      <div className="min-h-dvh bg-background p-6">
        <Story />
      </div>
    ),
  ],
  render: function Render(args) {
    const [, updateArgs] = useArgs()
    return (
      <EquipmentTagInput
        {...args}
        onChange={(value) => {
          args.onChange(value)
          updateArgs({ value })
        }}
      />
    )
  },
} satisfies Meta<typeof EquipmentTagInput>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {}

export const WithSelection: Story = {
  args: { value: ['balai', 'chiffon'] },
}
