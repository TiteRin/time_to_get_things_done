import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import type { TimelineEntry } from '@/domain/session'
import type { Task } from '@/domain/task'
import { ExecutionScreen } from '@/components/ExecutionScreen'
import { DebriefingScreen } from '@/components/DebriefingScreen'
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
  if (list.length === 0) return <Navigate to="/generation" replace />

  return <ExecutionSession tasks={list} />
}

function ExecutionSession({ tasks }: { tasks: Task[] }) {
  const { state, currentTask, toggle, next, openMenu, closeMenu, finish, restart } =
    useSession(tasks)

  if (state.status === 'ended' || !currentTask) {
    return <SessionDebriefing tasks={state.tasks} timeline={state.timeline} onRestart={restart} />
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

/** Shows the stored version of each task, so edits made from the debriefing show up at once */
function SessionDebriefing({
  tasks,
  timeline,
  onRestart,
}: {
  tasks: Task[]
  timeline: TimelineEntry[]
  onRestart: () => void
}) {
  const { tasks: stored, updateTask } = useTasks()
  const navigate = useNavigate()

  if (!stored) return null

  const byId = new Map(stored.map((task) => [task.id, task]))
  return (
    <DebriefingScreen
      tasks={tasks.map((task) => byId.get(task.id) ?? task)}
      timeline={timeline}
      onUpdateTask={(task) => void updateTask(task)}
      onRestart={onRestart}
      onClose={() => navigate('/generation')}
    />
  )
}
