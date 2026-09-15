import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { GenerationScreen } from '@/components/GenerationScreen'
import { sampleTasks } from '@/fixtures/tasks'

const meta = {
  title: 'Génération/GenerationScreen',
  component: GenerationScreen,
  args: {
    tasks: sampleTasks,
    selected: [sampleTasks[3], sampleTasks[0], sampleTasks[5]],
    onToggle: fn(),
    onRemove: fn(),
    onReorder: fn(),
    onNextStep: fn(),
    onPreviousStep: fn(),
    onStart: fn(),
  },
} satisfies Meta<typeof GenerationScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Selection: Story = {
  args: { step: 'select' },
}

export const SelectionVide: Story = {
  args: { step: 'select', selected: [] },
}

export const Ordonnancement: Story = {
  args: { step: 'order' },
}
