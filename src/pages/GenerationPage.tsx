import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { GenerationScreen } from '@/components/GenerationScreen'
import type { GenerationStep } from '@/components/GenerationScreen'
import { reorder, toggleId } from '@/domain/taskSelection'
import { useEquipment } from '@/hooks/useEquipment'
import { useRooms } from '@/hooks/useRooms'
import { useTasks } from '@/hooks/useTasks'
import { loadLastList, saveLastList } from '@/storage/lastList'

export function GenerationPage() {
  const { tasks } = useTasks()
  const { rooms } = useRooms()
  const { equipment } = useEquipment()
  const navigate = useNavigate()
  const [step, setStep] = useState<GenerationStep>('select')
  const [selectedIds, setSelectedIds] = useState<string[]>(loadLastList)

  const catalogue = tasks ?? []
  const byId = new Map(catalogue.map((task) => [task.id, task]))
  // The last saved list may reference tasks deleted since
  const validIds = selectedIds.filter((id) => byId.has(id))
  const selected = validIds.map((id) => byId.get(id)!)

  return (
    <GenerationScreen
      step={step}
      tasks={catalogue}
      rooms={rooms ?? []}
      equipment={equipment ?? []}
      selected={selected}
      onToggle={(id) => setSelectedIds(toggleId(validIds, id))}
      onRemove={(id) => setSelectedIds(validIds.filter((selectedId) => selectedId !== id))}
      onReorder={(from, to) => setSelectedIds(reorder(validIds, from, to))}
      onNextStep={() => setStep('order')}
      onPreviousStep={() => setStep('select')}
      onStart={() => {
        saveLastList(validIds)
        navigate('/execution')
      }}
      footerExtra={
        <Link to="/configuration" className="text-center font-medium text-emerald-400">
          Configuration
        </Link>
      }
    />
  )
}
