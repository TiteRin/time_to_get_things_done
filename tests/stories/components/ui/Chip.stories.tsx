import type { Meta, StoryObj } from '@storybook/react-vite'
import { useArgs } from 'storybook/preview-api'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Chip } from '@/components/ui/Chip'
import { uiStoryDecorator } from '../../../helpers/uiStory'

const meta = {
  title: 'UI/Chip',
  component: Chip,
  tags: ['autodocs'],
  args: { children: 'Moyen', selected: false, onClick: fn() },
  argTypes: { children: { control: 'text' } },
  decorators: [uiStoryDecorator],
  render: function Render(args) {
    const [, updateArgs] = useArgs()
    return (
      <Chip
        {...args}
        onClick={(event) => {
          args.onClick?.(event)
          updateArgs({ selected: !args.selected })
        }}
      />
    )
  },
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

/** An option that can be picked. Click it on the canvas to toggle it. */
export const Unselected: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Moyen' }))
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}

/** The picked option. */
export const Selected: Story = {
  args: { selected: true },
}

/** How pickers lay them out: a wrapping row inside a labelled group. */
export const InAGroup: Story = {
  render: () => (
    <div role="group" aria-label="Difficulté perçue" className="flex flex-wrap gap-2">
      <Chip selected={false}>Facile</Chip>
      <Chip selected>Moyen</Chip>
      <Chip selected={false}>Difficile</Chip>
    </div>
  ),
}
