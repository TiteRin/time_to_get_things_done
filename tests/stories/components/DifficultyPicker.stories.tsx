import type { Meta, StoryObj } from '@storybook/react-vite'
import { useArgs } from 'storybook/preview-api'
import { expect, fn, userEvent, within } from 'storybook/test'
import { DifficultyPicker } from '@/components/DifficultyPicker'

const meta = {
  title: 'Configuration/DifficultyPicker',
  component: DifficultyPicker,
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
      <DifficultyPicker
        {...args}
        onChange={(value) => {
          args.onChange(value)
          updateArgs({ value })
        }}
      />
    )
  },
} satisfies Meta<typeof DifficultyPicker>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Moyen' }))
    await expect(args.onChange).toHaveBeenCalledWith('medium')
  },
}

export const Selected: Story = {
  args: { value: 'hard' },
}
