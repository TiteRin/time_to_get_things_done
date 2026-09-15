import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Equipment } from '@/domain/equipment'
import { EquipmentTagInput } from '@/components/EquipmentTagInput'

const equipment: Equipment[] = [
  { id: 'balai', name: 'Balai' },
  { id: 'aspirateur', name: 'Aspirateur' },
  { id: 'chiffon', name: 'Chiffon' },
]

function setup(props: Partial<React.ComponentProps<typeof EquipmentTagInput>> = {}) {
  const onChange = vi.fn()
  const onAddEquipment = vi.fn()
  render(
    <EquipmentTagInput
      equipment={equipment}
      value={[]}
      onChange={onChange}
      onAddEquipment={onAddEquipment}
      {...props}
    />,
  )
  return { onChange, onAddEquipment }
}

describe('EquipmentTagInput', () => {
  it('shows the selected equipment as tags', () => {
    setup({ value: ['balai', 'chiffon'] })

    const list = screen.getByRole('list', { name: 'Matériel sélectionné' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(2)
    expect(within(list).getByText('Balai')).toBeInTheDocument()
    expect(within(list).getByText('Chiffon')).toBeInTheDocument()
    expect(within(list).queryByText('Aspirateur')).not.toBeInTheDocument()
  })

  it('removes a tag', async () => {
    const { onChange } = setup({ value: ['balai', 'chiffon'] })

    await userEvent.click(screen.getByRole('button', { name: 'Retirer Balai' }))

    expect(onChange).toHaveBeenCalledWith(['chiffon'])
  })

  it('asks the parent to add equipment by name', async () => {
    const { onAddEquipment } = setup()

    await userEvent.type(
      screen.getByRole('textbox', { name: 'Ajouter du matériel' }),
      'Serpillière',
    )
    await userEvent.click(screen.getByRole('button', { name: 'Ajouter' }))

    expect(onAddEquipment).toHaveBeenCalledWith('Serpillière')
  })

  it('clears the input after adding', async () => {
    setup()

    const input = screen.getByRole('textbox', { name: 'Ajouter du matériel' })
    await userEvent.type(input, 'Serpillière')
    await userEvent.click(screen.getByRole('button', { name: 'Ajouter' }))

    expect(input).toHaveValue('')
  })

  it('does not add blank equipment', async () => {
    const { onAddEquipment } = setup()

    await userEvent.type(screen.getByRole('textbox', { name: 'Ajouter du matériel' }), '   ')
    await userEvent.click(screen.getByRole('button', { name: 'Ajouter' }))

    expect(onAddEquipment).not.toHaveBeenCalled()
  })
})
