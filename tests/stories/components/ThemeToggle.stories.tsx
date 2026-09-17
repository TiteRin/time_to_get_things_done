import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemeContext } from '@/app/themeContext'
import { ThemeToggle } from '@/components/ThemeToggle'

const meta = {
  title: 'Composants/ThemeToggle',
  component: ThemeToggle,
} satisfies Meta<typeof ThemeToggle>

export default meta
type Story = StoryObj<typeof meta>

export const Clair: Story = {
  decorators: [
    (Story) => (
      <ThemeContext value={{ resolvedTheme: 'light', setOverride: () => {} }}>
        <Story />
      </ThemeContext>
    ),
  ],
}

export const Sombre: Story = {
  decorators: [
    (Story) => (
      <ThemeContext value={{ resolvedTheme: 'dark', setOverride: () => {} }}>
        <Story />
      </ThemeContext>
    ),
  ],
}
