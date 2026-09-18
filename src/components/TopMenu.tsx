import type { ReactNode } from 'react'
import { ActionOverlay } from '@/components/ui/ActionOverlay'
import { ThemeToggle } from './ThemeToggle'

export function TopMenu({
  onCancel,
  onFinish,
  children,
}: {
  onCancel: () => void
  onFinish: () => void
  children?: ReactNode
}) {
  return (
    <ActionOverlay
      label="Menu de la session"
      align="top"
      actions={[
        { label: 'Terminer', onClick: onFinish },
        { label: 'Annuler', variant: 'secondary', onClick: onCancel },
      ]}
      corner={<ThemeToggle />}
    >
      {children}
    </ActionOverlay>
  )
}
