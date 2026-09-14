import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { TopMenu } from '@/components/TopMenu'

const meta = {
  title: 'Exécution/TopMenu',
  component: TopMenu,
  args: { onCancel: fn(), onFinish: fn() },
  decorators: [
    (Story) => (
      <div className="relative h-dvh">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TopMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
