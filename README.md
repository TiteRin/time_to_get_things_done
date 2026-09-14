# Time To Get Things Done (TTGTD)

Une application pour faciliter l'exécution des tâches domestiques et lutter contre la dysfonction exécutive.

## Objectif

Aider les personnes qui :
- ont du mal à se lancer dans les tâches domestiques,
- ont une mauvaise perception du temps que prend une tâche,
- *side-questent* durant les tâches ménagères (se laissent distraire, changent de tâche en cours de route),

à démarrer, enchaîner et terminer leurs corvées plus facilement.

## Concept

L'utilisateur configure ses tâches ménagères (nom, durée prévue, difficulté perçue, pièce, matériel nécessaire), puis génère une liste de tâches à exécuter à partir de filtres (temps disponible, pièce, difficulté). Un écran d'exécution plein écran guide une tâche à la fois avec un chronomètre silencieux, et un débriefing en fin de session compare temps prévu et temps réel.

### Écrans prévus

1. **Configuration** — créer et paramétrer les tâches (une liste prédéfinie de noms est fournie, à compléter)
2. **Génération** — filtrer et générer une liste de tâches optimisée (minimiser les changements de pièce/matériel), avec ajustement manuel possible
3. **Exécution** — interface plein écran, une tâche à la fois, avec chronomètre et navigation par tap/swipe (pause, annuler, terminer, tâche suivante)
4. **Débriefing** — comparaison temps prévu/temps réel, mise à jour des estimations, saisie de la difficulté réelle

À plus long terme (hors MVP) : un écran d'historique des sessions, un écran de planification.

## Stack

- PWA (React + Vite), installable sur mobile
- Persistance 100% locale (IndexedDB) pour le MVP — pas de backend, pas de compte utilisateur

## Statut

Projet à l'état de brief — aucun code n'a encore été écrit.

## Prochaines étapes

- [ ] Scaffolder le projet (Vite + React + TypeScript)
- [ ] Définir le modèle de données des tâches (schéma IndexedDB)
- [ ] Construire l'écran de configuration (CRUD tâches + liste prédéfinie)
- [ ] Construire l'écran de création de liste manuelle (sans génération automatique pour le MVP)
- [ ] Construire l'écran d'exécution plein écran (tap/swipe, chronomètre, timeline d'actions)
- [ ] Construire l'écran de débriefing (temps prévu vs réel, mise à jour des estimations)
- [ ] Rendre l'app installable en PWA (manifest, service worker)
- [ ] Une fois le MVP validé : écran de génération filtrée/optimisée, historique des sessions, planification

## Licence

MIT — voir [`LICENSE`](LICENSE).
