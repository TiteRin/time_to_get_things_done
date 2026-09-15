import { useState } from 'react'
import { Link } from 'react-router'
import { TaskForm } from '@/components/TaskForm'
import { TaskList } from '@/components/TaskList'
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

  return (
    <main className="min-h-dvh bg-slate-900 p-6">
      <h1 className="mb-6 text-xl font-semibold text-slate-100">Configuration</h1>

      {form.open ? (
        <TaskForm
          key={form.task?.id ?? 'new'}
          task={form.task}
          rooms={rooms ?? []}
          equipment={equipment ?? []}
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
            className="mb-6 rounded-xl bg-emerald-500 px-4 py-3 font-medium text-slate-950"
          >
            Ajouter une tâche
          </button>
          <TaskList
            tasks={tasks ?? []}
            rooms={rooms ?? []}
            onSelect={(task) => setForm({ open: true, task })}
          />
          <Link to="/" className="mt-6 block text-center font-medium text-emerald-400">
            Lancer la session
          </Link>
        </>
      )}
    </main>
  )
}
