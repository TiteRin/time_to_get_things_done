import type { ComponentType } from 'react'

/**
 * Themed backdrop for UI primitive stories. Fills the viewport on the canvas (so the dark
 * theme has no white band below), but stays compact on Docs pages, where several stories
 * are stacked inline.
 */
export function uiStoryDecorator(Story: ComponentType, { viewMode }: { viewMode?: string }) {
  return (
    <div
      className={`flex flex-col items-start gap-4 bg-background p-6 text-foreground ${
        viewMode === 'docs' ? '' : 'min-h-dvh'
      }`}
    >
      <Story />
    </div>
  )
}
