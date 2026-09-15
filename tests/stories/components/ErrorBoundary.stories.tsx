import type { Meta, StoryObj } from '@storybook/react-vite'
import { ErrorBoundary } from '@/components/ErrorBoundary'

function Broken(): never {
  throw new Error('boom')
}

const meta = {
  title: 'App/ErrorBoundary',
  component: ErrorBoundary,
} satisfies Meta<typeof ErrorBoundary>

export default meta
type Story = StoryObj<typeof meta>

export const Failed: Story = {
  args: { children: <Broken /> },
}
