import type { Task } from './task'

/** Total expected duration of a selection, in minutes; tasks without a duration count for zero */
export const totalExpectedDuration = (tasks: Task[]) =>
  tasks.reduce((total, task) => total + (task.expectedDuration ?? 0), 0)

/** Adds the id at the end of the selection, or removes it if already selected */
export const toggleId = (ids: string[], id: string) =>
  ids.includes(id) ? ids.filter((selected) => selected !== id) : [...ids, id]

/** Moves an item from one index to another; invalid moves return the same array */
export function reorder<T>(items: T[], from: number, to: number): T[] {
  const outOfRange = (index: number) => index < 0 || index >= items.length
  if (from === to || outOfRange(from) || outOfRange(to)) return items

  const moved = [...items]
  const [item] = moved.splice(from, 1)
  moved.splice(to, 0, item)
  return moved
}
