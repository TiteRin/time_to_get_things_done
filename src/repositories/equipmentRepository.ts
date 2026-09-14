import type { TtgtdDatabase } from '@/db/database'
import type { Equipment } from '@/domain/equipment'
import { namedEntityRepository } from './namedEntityRepository'

const equipment = namedEntityRepository<Equipment>('Le nom du matériel est obligatoire')

export const listEquipment = (db: TtgtdDatabase) => equipment.list(db.equipment)

export const findOrCreateEquipment = (db: TtgtdDatabase, name: string) =>
  equipment.findOrCreate(db.equipment, name)
