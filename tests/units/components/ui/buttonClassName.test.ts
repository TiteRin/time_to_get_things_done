import { describe, expect, it } from 'vitest'
import { buttonClassName } from '@/components/ui/buttonClassName'

describe('buttonClassName', () => {
  it('defaults to a medium primary button', () => {
    expect(buttonClassName()).toBe(buttonClassName({ variant: 'primary', size: 'md' }))
  })

  it('differs per variant and per size', () => {
    const classNames = new Set(
      (['primary', 'secondary'] as const).flatMap((variant) =>
        (['sm', 'md', 'lg'] as const).map((size) => buttonClassName({ variant, size })),
      ),
    )
    expect(classNames.size).toBe(6)
  })
})
