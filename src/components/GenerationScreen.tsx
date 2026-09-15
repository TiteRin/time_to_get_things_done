import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { ReactNode } from 'react'
import type { Equipment } from '@/domain/equipment'
import type { Room } from '@/domain/room'
import { groupTasksByRoom } from '@/domain/taskGrouping'
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
    <main className="flex min-h-dvh flex-col bg-slate-900 p-6 pb-0">
      <h1 className="mb-6 text-xl font-semibold text-slate-100">
        {step === 'select' ? 'Choisir les tâches' : 'Ordonner les tâches'}
      </h1>

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

      <footer className="sticky bottom-0 -mx-6 mt-6 flex flex-col gap-4 border-t border-slate-800 bg-slate-900 px-6 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <p aria-live="polite" className="text-center text-sm text-slate-400">
          {summary}
        </p>
        <div className="flex gap-4">
          {step === 'select' ? (
            <button
              type="button"
              onClick={onNextStep}
              disabled={count === 0}
              className="flex-1 rounded-xl border border-slate-600 py-3 font-medium text-slate-100 disabled:opacity-40"
            >
              Étape suivante
            </button>
          ) : (
            <button
              type="button"
              onClick={onPreviousStep}
              className="flex-1 rounded-xl border border-slate-600 py-3 font-medium text-slate-100"
            >
              Étape précédente
            </button>
          )}
          <button
            type="button"
            onClick={onStart}
            disabled={count === 0}
            className="flex-1 rounded-xl bg-emerald-500 py-3 font-medium text-slate-950 disabled:opacity-40"
          >
            Démarrer
          </button>
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
  const groups = groupTasksByRoom(tasks, rooms)

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
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <section key={group.id ?? 'no-room'}>
          <h2 className="mb-1 text-sm font-medium text-slate-400">{group.name}</h2>
          <ul className="flex flex-col divide-y divide-slate-700">
            {group.tasks.map((task) => {
              const isSelected = selectedIds.has(task.id)
              return (
                // scroll-mb keeps a focused row visible above the sticky footer
                <li key={task.id} className="flex scroll-mb-40 items-center gap-4 py-3">
                  <span className="flex-1">
                    <span
                      className={`block font-medium ${isSelected ? 'text-emerald-400' : 'text-slate-100'}`}
                    >
                      {task.name}
                    </span>
                    <span id={`task-details-${task.id}`} className="block text-sm text-slate-400">
                      {details(task)}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggle(task.id)}
                    aria-pressed={isSelected}
                    aria-describedby={`task-details-${task.id}`}
                    aria-label={`${isSelected ? 'Désélectionner' : 'Sélectionner'} ${task.name}`}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950'
                        : 'border border-slate-600 text-slate-100'
                    }`}
                  >
                    {isSelected ? 'Désélectionner' : 'Sélectionner'}
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
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
        <ul className="flex flex-col divide-y divide-slate-700">
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
      className="flex items-center gap-4 bg-slate-900 py-3"
    >
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
        className="cursor-grab touch-none px-1 text-lg text-slate-400"
      >
        ⠿
      </button>
      <span className="flex-1">
        <span className="block font-medium text-slate-100">{task.name}</span>
        <span className="block text-sm text-slate-400">{roomName}</span>
      </span>
      <button
        type="button"
        onClick={() => onRemove(task.id)}
        aria-label={`Retirer ${task.name}`}
        className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm font-medium text-slate-100"
      >
        Retirer
      </button>
    </li>
  )
}
