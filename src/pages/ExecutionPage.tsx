import { useState } from 'react'
import { Link, Navigate } from 'react-router'
import type { Task } from '@/domain/task'
import { ExecutionScreen } from '@/components/ExecutionScreen'
import { SessionEndScreen } from '@/components/SessionEndScreen'
import { useSession } from '@/hooks/useSession'
import { useTasks } from '@/hooks/useTasks'
import { loadLastList } from '@/storage/lastList'

export function ExecutionPage({ tasks }: { tasks?: Task[] }) {
  return tasks ? <ExecutionSession tasks={tasks} /> : <LastListSession />
}

/** Runs the list saved by the Génération screen; the session itself is never persisted */
function LastListSession() {
  const { tasks } = useTasks()
  // Read once: the session must not restart if the storage changes mid-run
  const [ids] = useState(loadLastList)

  if (!tasks) return null

  const byId = new Map(tasks.map((task) => [task.id, task]))
  const list = ids.flatMap((id) => byId.get(id) ?? [])
  if (list.length === 0) return <Navigate to="/" replace />

  return <ExecutionSession tasks={list} />
}

function ExecutionSession({ tasks }: { tasks: Task[] }) {
  const { state, currentTask, toggle, next, openMenu, closeMenu, finish } = useSession(tasks)

  if (state.status === 'ended' || !currentTask) {
    return (
      <SessionEndScreen
        tasks={state.tasks}
        timeline={state.timeline}
        footer={
          <div className="flex flex-col gap-2">
            <Link to="/" className="font-medium text-accent-secondary">
              Nouvelle liste
            </Link>
            <Link to="/configuration" className="font-medium text-accent-secondary">
              Configuration
            </Link>
          </div>
        }
      />
    )
  }

  return (
    <ExecutionScreen
      task={currentTask}
      status={state.status}
      menuOpen={state.menuOpen}
      position={state.currentIndex + 1}
      total={state.tasks.length}
      onToggle={toggle}
      onNext={next}
      onOpenMenu={openMenu}
      onCloseMenu={closeMenu}
      onFinish={finish}
      menuExtra={
        <Link to="/configuration" className="font-medium text-accent-secondary">
          Configuration
        </Link>
      }
    />
  )
}
