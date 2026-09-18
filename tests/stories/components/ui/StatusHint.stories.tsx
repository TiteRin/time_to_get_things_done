import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatusHint } from '@/components/ui/StatusHint'
import { uiStoryDecorator } from '../../../helpers/uiStory'

const meta = {
  title: 'UI/StatusHint',
  component: StatusHint,
  tags: ['autodocs'],
  args: { status: 'idle' },
  argTypes: { status: { control: 'inline-radio', options: ['idle', 'running', 'paused'] } },
  decorators: [uiStoryDecorator],
} satisfies Meta<typeof StatusHint>

export default meta
type Story = StoryObj<typeof meta>

/** Invites the first tap. */
export const Idle: Story = {}

/** The pulsing dot signals the silent timer is running. */
export const Running: Story = { args: { status: 'running' } }

/** No dot: nothing is being timed. */
export const Paused: Story = { args: { status: 'paused' } }
