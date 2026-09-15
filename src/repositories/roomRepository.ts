import type { Room } from '@/domain/room'
import { namedEntityRepository } from './namedEntityRepository'

const rooms = namedEntityRepository<Room>((db) => db.rooms, 'Le nom de la pièce est obligatoire')

export const listRooms = rooms.list
export const findOrCreateRoom = rooms.findOrCreate
