import { useLiveQuery } from 'dexie-react-hooks'
import { useMemo } from 'react'
import * as equipmentRepository from '@/repositories/equipmentRepository'
import { useDatabase } from './useDatabase'

/** Live list of equipment (`undefined` while loading) */
export function useEquipment() {
  const db = useDatabase()
  const equipment = useLiveQuery(() => equipmentRepository.listEquipment(db), [db])

  const actions = useMemo(
    () => ({
      findOrCreateEquipment: (name: string) => equipmentRepository.findOrCreateEquipment(db, name),
    }),
    [db],
  )

  return { equipment, ...actions }
}
