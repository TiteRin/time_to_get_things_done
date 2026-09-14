import type { Room } from '@/domain/room'
import type { Task } from '@/domain/task'

/*
 * Starter catalogue copied into each user's local database on first launch.
 * Editing it only affects new users: existing copies are never touched.
 * Ids are readable slugs; anything the user creates later gets a UUID, so they cannot collide.
 */

const roomNames = {
  salon: 'Salon',
  cuisine: 'Cuisine',
  'salle-de-bain': 'Salle de bain',
  toilettes: 'Toilettes',
  chambre: 'Chambre',
} as const

type DefaultRoomId = keyof typeof roomNames

const taskNamesByRoom: Record<DefaultRoomId, string[]> = {
  salon: [
    'Passer le balai',
    'Nettoyer les sols',
    'Ranger les surfaces',
    'Faire les poussières',
    'Nettoyer les fontaines',
  ],
  cuisine: [
    'Passer le balai',
    'Nettoyer les sols',
    'Ranger les surfaces',
    'Nettoyer les surfaces',
    'Faire la vaisselle',
    "Nettoyer l'évier",
    'Nettoyer la cuisinière',
    'Vider le frigo',
    'Nettoyer le frigo',
    'Planifier les repas',
    'Commander les courses',
    'Nettoyer le micro-onde',
    'Nettoyer le four',
  ],
  'salle-de-bain': [
    'Ranger la salle de bain',
    'Passer le balai',
    'Nettoyer les sols',
    "Nettoyer la baignoire et l'évier",
    'Faire une lessive',
    'Ranger les vêtements',
  ],
  toilettes: ['Passer le balai', 'Nettoyer les sols', 'Nettoyer les toilettes'],
  chambre: ['Passer le balai', 'Faire le lit', 'Laver les draps'],
}

const taskNamesWithoutRoom = ['Faire les litières', 'Aspirer']

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const defaultRooms: Room[] = Object.entries(roomNames).map(([id, name]) => ({ id, name }))

export const defaultTasks: Task[] = [
  ...Object.entries(taskNamesByRoom).flatMap(([roomId, names]) =>
    names.map((name) => ({ id: `${roomId}-${slugify(name)}`, name, roomId })),
  ),
  ...taskNamesWithoutRoom.map((name) => ({ id: slugify(name), name })),
]
