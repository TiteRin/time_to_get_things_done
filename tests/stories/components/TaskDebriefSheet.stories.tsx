import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type ComponentProps } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'
import { TaskDebriefSheet } from '@/components/TaskDebriefSheet'

type SheetProps = ComponentProps<typeof TaskDebriefSheet>

/** Holds the edits in state, like the screen does through the database */
function StatefulSheet({ task: initialTask, ...args }: SheetProps) {
  const [task, setTask] = useState(initialTask)
  const [actualDifficulty, setActualDifficulty] = useState(args.actualDifficulty)

  return (
    <TaskDebriefSheet
      {...args}
      task={task}
      actualDifficulty={actualDifficulty}
      onActualDifficultyChange={(value) => {
        args.onActualDifficultyChange(value)
        setActualDifficulty(value)
      }}
      onUpdateTask={(updated) => {
        args.onUpdateTask(updated)
        setTask(updated)
      }}
    />
  )
}

const meta = {
  title: 'Débriefing/TaskDebriefSheet',
  component: TaskDebriefSheet,
  args: {
    task: {
      id: 'a',
      name: 'Faire la vaisselle',
      expectedDuration: 15,
      perceivedDifficulty: 'medium',
    },
    totalMs: 210_000,
    effectiveMs: 180_000,
    onActualDifficultyChange: fn(),
    onUpdateTask: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof TaskDebriefSheet>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const sheet = within(canvasElement).getByRole('dialog', { name: 'Faire la vaisselle' })
    await expect(sheet).toHaveTextContent('Durée totale3 min 30 s')
    await expect(sheet).toHaveTextContent('Durée effective3 min')
    await expect(sheet).toHaveTextContent('Durée prévue15 min')
    await expect(sheet).toHaveTextContent('DifficultéMoyen')

    await userEvent.click(within(sheet).getByRole('button', { name: 'Fermer le détail' }))
    await expect(args.onClose).toHaveBeenCalled()
  },
}

export const WithoutExpectedDuration: Story = {
  args: { task: { id: 'b', name: 'Faire les litières' } },
  play: async ({ canvasElement }) => {
    const sheet = within(canvasElement).getByRole('dialog')
    await expect(sheet).toHaveTextContent('Durée prévuenon renseignée')
    await expect(sheet).toHaveTextContent('Difficulténon renseignée')
  },
}

export const EditingExpectedDuration: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Modifier la durée prévue' }))

    // Prefilled with the effective duration, in minutes
    const input = canvas.getByRole('spinbutton', { name: 'Durée prévue (minutes)' })
    await expect(input).toHaveValue(3)

    await userEvent.clear(input)
    await userEvent.type(input, '4')
    await userEvent.click(canvas.getByRole('button', { name: 'Enregistrer' }))

    await expect(args.onUpdateTask).toHaveBeenCalledWith({ ...args.task, expectedDuration: 4 })
    await expect(canvas.queryByRole('spinbutton')).not.toBeInTheDocument()
  },
}

export const EditingDifficulty: Story = {
  args: { actualDifficulty: 'easy' },
  render: (args) => <StatefulSheet {...args} />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Renseigner la difficulté' }))

    const actual = within(canvas.getByRole('group', { name: 'Difficulté réelle' }))
    await expect(actual.getByRole('button', { name: 'Facile' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await userEvent.click(actual.getByRole('button', { name: 'Difficile' }))
    await expect(args.onActualDifficultyChange).toHaveBeenCalledWith('hard')
    await expect(actual.getByRole('button', { name: 'Difficile' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )

    const perceived = within(canvas.getByRole('group', { name: 'Difficulté perçue' }))
    await userEvent.click(perceived.getByRole('button', { name: 'Difficile' }))
    await expect(args.onUpdateTask).toHaveBeenCalledWith({
      ...args.task,
      perceivedDifficulty: 'hard',
    })
    await expect(perceived.getByRole('button', { name: 'Difficile' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  },
}
