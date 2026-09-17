import { useState } from 'react'
import { Link } from 'react-router'
import { TaskForm } from '@/components/TaskForm'
import { TaskList } from '@/components/TaskList'
import { ThemeToggle } from '@/components/ThemeToggle'
import type { Task } from '@/domain/task'
import { useEquipment } from '@/hooks/useEquipment'
import { useRooms } from '@/hooks/useRooms'
import { useTasks } from '@/hooks/useTasks'

type FormState = { open: false } | { open: true; task?: Task }

export function ConfigurationPage() {
  const { tasks, createTask, updateTask } = useTasks()
  const { rooms, findOrCreateRoom } = useRooms()
  const { equipment, findOrCreateEquipment } = useEquipment()
  const [form, setForm] = useState<FormState>({ open: false })

  // Rendering before the three live queries resolve would regroup the list under the
  // user's finger once the rooms arrive, swapping the DOM nodes and losing the tap
  const loading = !tasks || !rooms || !equipment

  return (
    <main className="min-h-dvh bg-background p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Configuration</h1>
        <ThemeToggle />
      </div>

      {loading ? null : form.open ? (
        <TaskForm
          key={form.task?.id ?? 'new'}
          task={form.task}
          rooms={rooms}
          equipment={equipment}
          onSubmit={async (input) => {
            await (form.task ? updateTask({ ...input, id: form.task.id }) : createTask(input))
            setForm({ open: false })
          }}
          onAddRoom={findOrCreateRoom}
          onAddEquipment={findOrCreateEquipment}
        />
      ) : (
        <>
          <button
            type="button"
            onClick={() => setForm({ open: true })}
            className="mb-6 rounded-xl bg-accent px-4 py-3 font-medium text-accent-foreground"
          >
            Ajouter une tâche
          </button>
          <TaskList
            tasks={tasks}
            rooms={rooms}
            onSelect={(task) => setForm({ open: true, task })}
          />
          <Link to="/generation" className="mt-6 block text-center font-medium text-accent-secondary">
            Créer une liste
          </Link>
        </>
      )}
    </main>
  )
}
