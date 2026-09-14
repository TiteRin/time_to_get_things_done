import Dexie, { type EntityTable } from 'dexie'
import { defaultRooms, defaultTasks } from '@/catalog/defaultCatalog'
import type { Equipment } from '@/domain/equipment'
import type { Room } from '@/domain/room'
import type { Task } from '@/domain/task'

export class TtgtdDatabase extends Dexie {
  tasks!: EntityTable<Task, 'id'>
  rooms!: EntityTable<Room, 'id'>
  equipment!: EntityTable<Equipment, 'id'>

  constructor(name = 'ttgtd') {
    super(name)

    this.version(1).stores({
      tasks: 'id, roomId, *equipmentIds',
      rooms: 'id',
      equipment: 'id',
    })

    // Runs only when the database is created, i.e. on the user's first launch
    this.on('populate', async (tx) => {
      await tx.table('rooms').bulkAdd(defaultRooms)
      await tx.table('tasks').bulkAdd(defaultTasks)
    })
  }
}
