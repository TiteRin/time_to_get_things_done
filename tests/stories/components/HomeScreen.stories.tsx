import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { HomeScreen } from '@/components/HomeScreen'

const meta = {
  title: 'Accueil/HomeScreen',
  component: HomeScreen,
  args: { onGenerate: fn(), onChrono: fn() },
} satisfies Meta<typeof HomeScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    footerExtra: (
      <a href="/configuration" className="font-medium text-emerald-400">
        Configuration
      </a>
    ),
  },
}
