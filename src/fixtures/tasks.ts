import type { Task } from '@/domain/task'

/** Sample chores from the brief, used until the Configuration screen exists */
export const sampleTasks: Task[] = [
  {
    id: 'balai-salon',
    name: 'Passer le balai dans le salon',
    expectedDuration: 5,
    perceivedDifficulty: 'easy',
    roomId: 'salon',
  },
  {
    id: 'balai-cuisine',
    name: 'Passer le balai dans la cuisine',
    expectedDuration: 5,
    perceivedDifficulty: 'easy',
    roomId: 'cuisine',
  },
  {
    id: 'sol-salon',
    name: 'Nettoyer le sol du salon',
    expectedDuration: 10,
    perceivedDifficulty: 'medium',
    roomId: 'salon',
  },
  {
    id: 'vaisselle',
    name: 'Faire la vaisselle',
    expectedDuration: 15,
    perceivedDifficulty: 'medium',
    roomId: 'cuisine',
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
    roomId: 'toilettes',
  },
  {
    id: 'salle-de-bain',
    name: 'Nettoyer la salle de bain',
    expectedDuration: 20,
    perceivedDifficulty: 'hard',
    roomId: 'salle-de-bain',
  },
  {
    id: 'ranger-sdb',
    name: 'Ranger la salle de bain',
    expectedDuration: 10,
    perceivedDifficulty: 'medium',
    roomId: 'salle-de-bain',
  },
  {
    id: 'miroirs',
    name: 'Nettoyer les miroirs',
    expectedDuration: 5,
    perceivedDifficulty: 'medium',
    roomId: 'salle-de-bain',
  },
]
