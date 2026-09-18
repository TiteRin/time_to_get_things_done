import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { GroupedTaskList } from '@/components/ui/GroupedTaskList'
import { ScreenHeader } from '@/components/ui/ScreenHeader'
import { TaskItem } from '@/components/ui/TaskItem'
import type { Equipment } from '@/domain/equipment'
import type { Room } from '@/domain/room'
import { difficultyLabels } from '@/domain/task'
import type { Task } from '@/domain/task'
import { totalExpectedDuration } from '@/domain/taskSelection'

export type GenerationStep = 'select' | 'order'

export function GenerationScreen({
  step,
  tasks,
  rooms,
  equipment,
  selected,
  onToggle,
  onRemove,
  onReorder,
  onNextStep,
  onPreviousStep,
  onStart,
  footerExtra,
}: {
  step: GenerationStep
  /** The whole catalogue, shown during the selection step */
  tasks: Task[]
  rooms: Room[]
  equipment: Equipment[]
  /** The selection, in execution order */
  selected: Task[]
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  onReorder: (from: number, to: number) => void
  onNextStep: () => void
  onPreviousStep: () => void
  onStart: () => void
  /** Extra navigation rendered under the step buttons (e.g. a Configuration link) */
  footerExtra?: ReactNode
}) {
  const count = selected.length
  const summary = `${count} tâche${count > 1 ? 's' : ''} sélectionnée${count > 1 ? 's' : ''}, durée approximative ~ ${totalExpectedDuration(selected)} minutes`

  return (
    // The footer supplies the bottom padding so it can stick flush to the viewport
    <main className="flex min-h-dvh flex-col bg-background p-6 pb-0">
      <ScreenHeader
        title={step === 'select' ? 'Choisir les tâches' : 'Ordonner les tâches'}
        className="mb-6"
      />

      <div className="flex-1">
        {step === 'select' ? (
          <SelectionList
            tasks={tasks}
            rooms={rooms}
            equipment={equipment}
            selected={selected}
            onToggle={onToggle}
          />
        ) : (
          <OrderingList
            selected={selected}
            rooms={rooms}
            onRemove={onRemove}
            onReorder={onReorder}
          />
        )}
      </div>

      <footer className="sticky bottom-0 -mx-6 mt-6 flex flex-col gap-4 border-t border-border bg-background px-6 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <p aria-live="polite" className="text-center text-sm text-muted-foreground">
          {summary}
        </p>
        <div className="flex gap-4">
          {step === 'select' ? (
            <Button
              variant="secondary"
              onClick={onNextStep}
              disabled={count === 0}
              className="flex-1"
            >
              Étape suivante
            </Button>
          ) : (
            <Button variant="secondary" onClick={onPreviousStep} className="flex-1">
              Étape précédente
            </Button>
          )}
          <Button onClick={onStart} disabled={count === 0} className="flex-1">
            Démarrer
          </Button>
        </div>
        {footerExtra}
      </footer>
    </main>
  )
}

function SelectionList({
  tasks,
  rooms,
  equipment,
  selected,
  onToggle,
}: {
  tasks: Task[]
  rooms: Room[]
  equipment: Equipment[]
  selected: Task[]
  onToggle: (id: string) => void
}) {
  const selectedIds = new Set(selected.map((task) => task.id))
  const equipmentById = new Map(equipment.map((item) => [item.id, item.name]))
  // Duration and difficulty are always labelled, even when not filled in yet
  const details = (task: Task) => {
    const equipmentNames = task.equipmentIds
      ?.flatMap((id) => equipmentById.get(id) ?? [])
      .join(', ')
    return [
      `Durée : ${task.expectedDuration !== undefined ? `${task.expectedDuration} min` : 'non renseignée'}`,
      `Difficulté : ${task.perceivedDifficulty ? difficultyLabels[task.perceivedDifficulty] : 'non renseignée'}`,
      equipmentNames && `Matériel : ${equipmentNames}`,
    ]
      .filter(Boolean)
      .join(' · ')
  }

  return (
    <GroupedTaskList
      tasks={tasks}
      rooms={rooms}
      // scroll-mb keeps a focused row visible above the sticky footer
      rowClassName="scroll-mb-40"
      renderRow={(task) => {
        const isSelected = selectedIds.has(task.id)
        const detailsId = `task-details-${task.id}`
        return (
          <TaskItem
            name={task.name}
            selected={isSelected}
            details={details(task)}
            detailsId={detailsId}
            trailing={
              <Button
                size="sm"
                variant={isSelected ? 'primary' : 'secondary'}
                onClick={() => onToggle(task.id)}
                aria-pressed={isSelected}
                aria-describedby={detailsId}
                aria-label={`${isSelected ? 'Désélectionner' : 'Sélectionner'} ${task.name}`}
              >
                {isSelected ? 'Désélectionner' : 'Sélectionner'}
              </Button>
            }
          />
        )
      }}
    />
  )
}

function OrderingList({
  selected,
  rooms,
  onRemove,
  onReorder,
}: {
  selected: Task[]
  rooms: Room[]
  onRemove: (id: string) => void
  onReorder: (from: number, to: number) => void
}) {
  const roomNameById = new Map(rooms.map((room) => [room.id, room.name]))
  // A small drag threshold keeps plain taps on the remove buttons working
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    const indexOf = (id: typeof active.id) => selected.findIndex((task) => task.id === id)
    onReorder(indexOf(active.id), indexOf(over.id))
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      accessibility={{
        screenReaderInstructions: {
          draggable: 'Utilisez les flèches haut et bas pour déplacer la tâche dans la liste.',
        },
      }}
    >
      <SortableContext
        items={selected.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="flex flex-col divide-y divide-border">
          {selected.map((task, index) => (
            <OrderingItem
              key={task.id}
              task={task}
              roomName={(task.roomId && roomNameById.get(task.roomId)) || 'Aucune pièce'}
              index={index}
              onRemove={onRemove}
              onReorder={onReorder}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  )
}

function OrderingItem({
  task,
  roomName,
  index,
  onRemove,
  onReorder,
}: {
  task: Task
  roomName: string
  index: number
  onRemove: (id: string) => void
  onReorder: (from: number, to: number) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id })

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="bg-background"
    >
      <TaskItem
        name={task.name}
        details={roomName}
        leading={
          <button
            type="button"
            {...attributes}
            {...listeners}
            aria-label={`Déplacer ${task.name}`}
            onKeyDown={(event) => {
              if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
              event.preventDefault()
              onReorder(index, event.key === 'ArrowDown' ? index + 1 : index - 1)
            }}
            className="cursor-grab touch-none px-1 text-lg text-muted-foreground"
          >
            ⠿
          </button>
        }
        trailing={
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onRemove(task.id)}
            aria-label={`Retirer ${task.name}`}
          >
            Retirer
          </Button>
        }
      />
    </li>
  )
}
