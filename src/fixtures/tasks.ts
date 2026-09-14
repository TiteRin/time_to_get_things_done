import type { Task } from '@/domain/task'

/** Sample chores from the brief, used until the Configuration screen exists */
export const sampleTasks: Task[] = [
  {
    id: 'balai-salon',
    name: 'Passer le balai dans le salon',
    expectedDuration: 5,
    perceivedDifficulty: 'easy',
    room: 'salon',
    sharedEquipment: ['balai'],
  },
  {
    id: 'balai-cuisine',
    name: 'Passer le balai dans la cuisine',
    expectedDuration: 5,
    perceivedDifficulty: 'easy',
    room: 'cuisine',
    sharedEquipment: ['balai'],
  },
  {
    id: 'sol-salon',
    name: 'Nettoyer le sol du salon',
    expectedDuration: 10,
    perceivedDifficulty: 'medium',
    room: 'salon',
    sharedEquipment: ['serpillère'],
  },
  {
    id: 'vaisselle',
    name: 'Faire la vaisselle',
    expectedDuration: 15,
    perceivedDifficulty: 'medium',
    room: 'cuisine',
  },
  {
    id: 'litieres',
    name: 'Faire les litières',
    expectedDuration: 5,
    perceivedDifficulty: 'easy',
  },
  {
    id: 'toilettes',
    name: 'Nettoyer les toilettes',
    expectedDuration: 10,
    perceivedDifficulty: 'hard',
    room: 'wc',
    sharedEquipment: ['éponge', 'gants', 'seau eau + acide citrique'],
  },
  {
    id: 'salle-de-bain',
    name: 'Nettoyer la salle de bain',
    expectedDuration: 20,
    perceivedDifficulty: 'hard',
    room: 'salle de bain',
    sharedEquipment: ['éponge', 'gants', 'seau eau + acide citrique'],
  },
  {
    id: 'ranger-sdb',
    name: 'Ranger la salle de bain',
    expectedDuration: 10,
    perceivedDifficulty: 'medium',
    room: 'salle de bain',
  },
  {
    id: 'miroirs',
    name: 'Nettoyer les miroirs',
    expectedDuration: 5,
    perceivedDifficulty: 'medium',
    room: 'salle de bain',
    sharedEquipment: ['éponge'],
  },
]
