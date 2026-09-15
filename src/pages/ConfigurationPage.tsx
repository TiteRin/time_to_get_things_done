import { useState } from 'react'
import { TaskForm } from '@/components/TaskForm'
import { TaskList } from '@/components/TaskList'
import { useEquipment } from '@/hooks/useEquipment'
import { useRooms } from '@/hooks/useRooms'
import { useTasks } from '@/hooks/useTasks'

export function ConfigurationPage() {
  const { tasks, createTask } = useTasks()
  const { rooms, findOrCreateRoom } = useRooms()
  const { equipment, findOrCreateEquipment } = useEquipment()
  const [formOpen, setFormOpen] = useState(false)

  return (
    <main className="min-h-dvh bg-slate-900 p-6">
      <h1 className="mb-6 text-xl font-semibold text-slate-100">Configuration</h1>

      {formOpen ? (
        <TaskForm
          rooms={rooms ?? []}
          equipment={equipment ?? []}
          onSubmit={(input) => {
            void createTask(input)
            setFormOpen(false)
          }}
          onAddRoom={findOrCreateRoom}
          onAddEquipment={findOrCreateEquipment}
        />
      ) : (
        <>
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="mb-6 rounded-xl bg-emerald-500 px-4 py-3 font-medium text-slate-950"
          >
            Ajouter une tâche
          </button>
          <TaskList tasks={tasks ?? []} rooms={rooms ?? []} />
        </>
      )}
    </main>
  )
}
