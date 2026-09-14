import type { Room } from '@/domain/room'
import type { Task } from '@/domain/task'

/**
 * Starter catalogue copied into each user's local database on first launch.
 * Editing it only affects new users: existing copies are never touched.
 */
export const defaultRooms: Room[] = [
  { id: 'salon', name: 'Salon' },
  { id: 'cuisine', name: 'Cuisine' },
  { id: 'salle-de-bain', name: 'Salle de bain' },
  { id: 'toilettes', name: 'Toilettes' },
  { id: 'chambre', name: 'Chambre' },
]

const taskNamesByRoom: Record<Room['id'] | 'none', string[]> = {
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
  none: ['Faire les litières', 'Aspirer'],
}

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const defaultTasks: Task[] = Object.entries(taskNamesByRoom).flatMap(([roomId, names]) =>
  names.map((name) =>
    roomId === 'none'
      ? { id: slugify(name), name }
      : { id: `${roomId}-${slugify(name)}`, name, roomId },
  ),
)
