import { useLiveQuery } from 'dexie-react-hooks'
import { findOrCreateRoom, listRooms } from '@/repositories/roomRepository'
import { useDatabase } from './useDatabase'

/** Live list of rooms (`undefined` while loading) */
export function useRooms() {
  const db = useDatabase()
  const rooms = useLiveQuery(() => listRooms(db), [db])

  return {
    rooms,
    findOrCreateRoom: (name: string) => findOrCreateRoom(db, name),
  }
}
