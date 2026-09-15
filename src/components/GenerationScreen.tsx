import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { ReactNode } from 'react'
import type { Equipment } from '@/domain/equipment'
import { byName } from '@/domain/name'
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
          <OrderingList selected={selected} onRemove={onRemove} onReorder={onReorder} />
        )}
      </div>

      <footer className="sticky bottom-0 -mx-6 mt-6 flex flex-col gap-4 border-t border-slate-800 bg-slate-900 px-6 pt-4 pb-6">
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

  // Same grouping as the configuration TaskList: rooms sorted by name, roomless tasks last
  const groups = [...[...rooms].sort(byName), { id: undefined, name: 'Aucune pièce' }]
    .map((room) => ({
      ...room,
      tasks: tasks.filter((task) => task.roomId === room.id).sort(byName),
    }))
    .filter((group) => group.tasks.length > 0)

  const details = (task: Task) =>
    [
      task.expectedDuration !== undefined && `${task.expectedDuration} min`,
      task.perceivedDifficulty && difficultyLabels[task.perceivedDifficulty],
      task.equipmentIds
        ?.map((id) => equipmentById.get(id))
        .filter(Boolean)
        .join(', ') || false,
    ]
      .filter(Boolean)
      .join(' · ')

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <section key={group.id ?? 'no-room'}>
          <h2 className="mb-1 text-sm font-medium text-slate-400">{group.name}</h2>
          <ul className="flex flex-col divide-y divide-slate-700">
            {group.tasks.map((task) => {
              const isSelected = selectedIds.has(task.id)
              return (
                <li key={task.id} className="flex items-center gap-4 py-3">
                  <span className="flex-1">
                    <span
                      className={`block font-medium ${isSelected ? 'text-emerald-400' : 'text-slate-100'}`}
                    >
                      {task.name}
                    </span>
                    {details(task) && (
                      <span className="block text-sm text-slate-400">{details(task)}</span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggle(task.id)}
                    aria-pressed={isSelected}
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
  onRemove,
  onReorder,
}: {
  selected: Task[]
  onRemove: (id: string) => void
  onReorder: (from: number, to: number) => void
}) {
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
  index,
  onRemove,
  onReorder,
}: {
  task: Task
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
      <span className="flex-1 font-medium text-slate-100">{task.name}</span>
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
