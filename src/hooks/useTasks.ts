import { useLiveQuery } from 'dexie-react-hooks'
import type { Task } from '@/domain/task'
import {
  createTask,
  deleteTask,
  listTasks,
  updateTask,
  type TaskInput,
} from '@/repositories/taskRepository'
import { useDatabase } from './useDatabase'

/** Live list of tasks (`undefined` while loading) and the actions to change it */
export function useTasks() {
  const db = useDatabase()
  const tasks = useLiveQuery(() => listTasks(db), [db])

  return {
    tasks,
    createTask: (input: TaskInput) => createTask(db, input),
    updateTask: (task: Task) => updateTask(db, task),
    deleteTask: (id: Task['id']) => deleteTask(db, id),
  }
}
