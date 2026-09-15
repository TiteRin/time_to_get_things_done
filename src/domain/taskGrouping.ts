import { byName } from './name'
import type { Room } from './room'
import type { Task } from './task'

export type RoomGroup = { id?: string; name: string; tasks: Task[] }

/**
 * Groups tasks under their room (rooms sorted by name); tasks without a room —
 * or referencing a room that no longer exists — land in a final "Aucune pièce" group.
 * Empty groups are dropped.
 */
export function groupTasksByRoom(tasks: Task[], rooms: Room[]): RoomGroup[] {
  const knownRoomIds = new Set(rooms.map((room) => room.id))
  const inGroup = (task: Task, roomId?: string) =>
    roomId === undefined
      ? task.roomId === undefined || !knownRoomIds.has(task.roomId)
      : task.roomId === roomId

  return [...[...rooms].sort(byName), { id: undefined, name: 'Aucune pièce' }]
    .map((room) => ({
      ...room,
      tasks: tasks.filter((task) => inGroup(task, room.id)).sort(byName),
    }))
    .filter((group) => group.tasks.length > 0)
}
