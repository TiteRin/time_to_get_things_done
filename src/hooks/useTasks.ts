import { useLiveQuery } from 'dexie-react-hooks'
import { useMemo } from 'react'
import type { Task } from '@/domain/task'
import * as taskRepository from '@/repositories/taskRepository'
import type { TaskInput } from '@/repositories/taskRepository'
import { useDatabase } from './useDatabase'

/** Live list of tasks (`undefined` while loading) and the actions to change it */
export function useTasks() {
  const db = useDatabase()
  const tasks = useLiveQuery(() => taskRepository.listTasks(db), [db])

  // Stable identities so consumers can safely depend on the actions
  const actions = useMemo(
    () => ({
      createTask: (input: TaskInput) => taskRepository.createTask(db, input),
      updateTask: (task: Task) => taskRepository.updateTask(db, task),
      deleteTask: (id: Task['id']) => taskRepository.deleteTask(db, id),
    }),
    [db],
  )

  return { tasks, ...actions }
}
