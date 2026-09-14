import type { Equipment } from '@/domain/equipment'
import { namedEntityRepository } from './namedEntityRepository'

const equipment = namedEntityRepository<Equipment>(
  (db) => db.equipment,
  'Le nom du matériel est obligatoire',
)

export const listEquipment = equipment.list
export const findOrCreateEquipment = equipment.findOrCreate
