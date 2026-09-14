import type { Meta, StoryObj } from '@storybook/react-vite'
import { useArgs } from 'storybook/preview-api'
import { expect, fn, userEvent, within } from 'storybook/test'
import { DurationPicker } from '@/components/DurationPicker'

const meta = {
  title: 'Configuration/DurationPicker',
  component: DurationPicker,
  args: { onChange: fn() },
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
      <DurationPicker
        {...args}
        onChange={(value) => {
          args.onChange(value)
          updateArgs({ value })
        }}
      />
    )
  },
} satisfies Meta<typeof DurationPicker>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: '15 min' }))
    await expect(args.onChange).toHaveBeenCalledWith(15)
  },
}

export const Selected: Story = {
  args: { value: 20 },
}

export const NonPresetValue: Story = {
  args: { value: 25 },
}
