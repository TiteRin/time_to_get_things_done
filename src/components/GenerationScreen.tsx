import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from '@/domain/task'
import { totalExpectedDuration } from '@/domain/taskSelection'

export type GenerationStep = 'select' | 'order'

export function GenerationScreen({
  step,
  tasks,
  selected,
  onToggle,
  onRemove,
  onReorder,
  onNextStep,
  onPreviousStep,
  onStart,
}: {
  step: GenerationStep
  /** The whole catalogue, shown during the selection step */
  tasks: Task[]
  /** The selection, in execution order */
  selected: Task[]
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  onReorder: (from: number, to: number) => void
  onNextStep: () => void
  onPreviousStep: () => void
  onStart: () => void
}) {
  const count = selected.length
  const summary = `${count} tâche${count > 1 ? 's' : ''} sélectionnée${count > 1 ? 's' : ''}, durée approximative ~ ${totalExpectedDuration(selected)} minutes`

  return (
    <main className="flex min-h-dvh flex-col bg-slate-900 p-6">
      <h1 className="mb-6 text-xl font-semibold text-slate-100">
        {step === 'select' ? 'Choisir les tâches' : 'Ordonner les tâches'}
      </h1>

      <div className="flex-1">
        {step === 'select' ? (
          <SelectionList tasks={tasks} selected={selected} onToggle={onToggle} />
        ) : (
          <OrderingList selected={selected} onRemove={onRemove} onReorder={onReorder} />
        )}
      </div>

      <footer className="mt-6 flex flex-col gap-4">
        <p className="text-center text-sm text-slate-400">{summary}</p>
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
      </footer>
    </main>
  )
}

function SelectionList({
  tasks,
  selected,
  onToggle,
}: {
  tasks: Task[]
  selected: Task[]
  onToggle: (id: string) => void
}) {
  const selectedIds = new Set(selected.map((task) => task.id))

  return (
    <ul className="flex flex-col divide-y divide-slate-700">
      {tasks.map((task) => {
        const isSelected = selectedIds.has(task.id)
        return (
          <li key={task.id} className="flex items-center gap-4 py-3">
            <span
              className={`flex-1 font-medium ${isSelected ? 'text-emerald-400' : 'text-slate-100'}`}
            >
              {task.name}
            </span>
            <button
              type="button"
              onClick={() => onToggle(task.id)}
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
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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
      className="flex touch-none items-center gap-4 bg-slate-900 py-3"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`Déplacer ${task.name}`}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') onReorder(index, index + 1)
          if (event.key === 'ArrowUp') onReorder(index, index - 1)
        }}
        className="cursor-grab px-1 text-lg text-slate-400"
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
