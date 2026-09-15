import { Link } from 'react-router'
import type { Task } from '@/domain/task'
import { ExecutionScreen } from '@/components/ExecutionScreen'
import { SessionEndScreen } from '@/components/SessionEndScreen'
import { useSession } from '@/hooks/useSession'
import { sampleTasks } from '@/fixtures/tasks'

export function ExecutionPage({ tasks = sampleTasks }: { tasks?: Task[] }) {
  const { state, currentTask, toggle, next, openMenu, closeMenu, finish } = useSession(tasks)

  if (state.status === 'ended' || !currentTask) {
    return (
      <SessionEndScreen
        tasks={state.tasks}
        timeline={state.timeline}
        footer={
          <Link to="/configuration" className="font-medium text-emerald-400">
            Configuration
          </Link>
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
    />
  )
}
