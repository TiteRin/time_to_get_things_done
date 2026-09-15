import { useLiveQuery } from 'dexie-react-hooks'
import { useMemo } from 'react'
import * as roomRepository from '@/repositories/roomRepository'
import { useDatabase } from './useDatabase'

/** Live list of rooms (`undefined` while loading) */
export function useRooms() {
  const db = useDatabase()
  const rooms = useLiveQuery(() => roomRepository.listRooms(db), [db])

  const actions = useMemo(
    () => ({ findOrCreateRoom: (name: string) => roomRepository.findOrCreateRoom(db, name) }),
    [db],
  )

  return { rooms, ...actions }
}
