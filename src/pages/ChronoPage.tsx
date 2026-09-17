import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ChronoSaveScreen } from '@/components/ChronoSaveScreen'
import { ChronoScreen } from '@/components/ChronoScreen'
import { TaskPicker } from '@/components/TaskPicker'
import { actualDurationMs, elapsedMs, totalDurationMs } from '@/domain/session'
import type { Difficulty, Task } from '@/domain/task'
import { useRooms } from '@/hooks/useRooms'
import { useSession } from '@/hooks/useSession'
import { useTasks } from '@/hooks/useTasks'

export function ChronoPage() {
  const { tasks, updateTask } = useTasks()
  const { rooms } = useRooms()
  const navigate = useNavigate()
  const [pickedId, setPickedId] = useState<string>()

  if (!tasks || !rooms) return null

  const task = tasks.find((candidate) => candidate.id === pickedId)

  if (!task) {
    return (
      <TaskPicker
        tasks={tasks}
        rooms={rooms}
        onSelect={setPickedId}
        footerExtra={
          <Link to="/" className="font-medium text-emerald-400">
            Annuler
          </Link>
        }
      />
    )
  }

  return (
    <ChronoSession
      key={task.id}
      task={task}
      onSave={async (updates) => {
        await updateTask({ ...task, ...updates })
        navigate('/')
      }}
      onCancel={() => navigate('/')}
    />
  )
}

/** Runs a single-task session: reuses the same reducer as the Exécution screen */
function ChronoSession({
  task,
  onSave,
  onCancel,
}: {
  task: Task
  onSave: (updates: { expectedDuration?: number; perceivedDifficulty?: Difficulty }) => void
  onCancel: () => void
}) {
  const { state, toggle, finish } = useSession([task])
  const [now, setNow] = useState(() => Date.now())

  // Resyncs immediately on start/pause/resume so the display doesn't glitch until the next tick
  const handleToggle = () => {
    setNow(Date.now())
    toggle()
  }

  useEffect(() => {
    if (state.status !== 'running') return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [state.status])

  if (state.status === 'ended') {
    return (
      <ChronoSaveScreen
        task={task}
        totalMs={totalDurationMs(state.timeline, 0)}
        actualMs={actualDurationMs(state.timeline, 0)}
        onReplace={(minutes, difficulty) =>
          onSave({ expectedDuration: minutes, perceivedDifficulty: difficulty })
        }
        onSkip={(difficulty) => onSave({ perceivedDifficulty: difficulty })}
      />
    )
  }

  return (
    <ChronoScreen
      task={task}
      status={state.status}
      elapsedMs={elapsedMs(state.timeline, 0, now)}
      onToggle={handleToggle}
      onFinish={finish}
      onCancel={onCancel}
    />
  )
}
