import { useLiveQuery } from 'dexie-react-hooks'
import { findOrCreateEquipment, listEquipment } from '@/repositories/equipmentRepository'
import { useDatabase } from './useDatabase'

/** Live list of equipment (`undefined` while loading) */
export function useEquipment() {
  const db = useDatabase()
  const equipment = useLiveQuery(() => listEquipment(db), [db])

  return {
    equipment,
    findOrCreateEquipment: (name: string) => findOrCreateEquipment(db, name),
  }
}
