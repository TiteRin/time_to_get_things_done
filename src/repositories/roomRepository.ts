import type { TtgtdDatabase } from '@/db/database'
import type { Room } from '@/domain/room'
import { namedEntityRepository } from './namedEntityRepository'

const rooms = namedEntityRepository<Room>('Le nom de la pièce est obligatoire')

export const listRooms = (db: TtgtdDatabase) => rooms.list(db.rooms)

export const findOrCreateRoom = (db: TtgtdDatabase, name: string) =>
  rooms.findOrCreate(db.rooms, name)
