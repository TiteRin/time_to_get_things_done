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

MVP fonctionnel : configuration des tâches, création manuelle de liste, écran d'exécution et débriefing. Reste à rendre l'app installable (PWA).

- **Création de liste en deux étapes** : sélection dans le catalogue groupé par pièce (durée, difficulté — avec libellé même quand l'information n'est pas renseignée — et matériel affichés sous chaque nom), puis réarrangement par glisser-déposer (la pièce de chaque tâche est rappelée sous son nom) avec retrait possible ; récapitulatif (nombre de tâches, durée approximative) et boutons toujours visibles en bas de l'écran.
- **Persistance locale** : la dernière liste créée est mémorisée (localStorage) et resélectionnée à la prochaine visite ; le catalogue et les tâches configurées vivent dans IndexedDB.
- **Exécution** : plein écran, une tâche à la fois, chronomètre silencieux, chaque action enregistrée dans une timeline.
- **Débriefing** : timeline façon agenda (un bloc par tâche, hauteur proportionnelle à la durée, pauses hachurées à l'intérieur du bloc, attentes hachurées entre les blocs) avec un axe des temps en délais depuis le début de la session. Détail d'une tâche dans une modale (durée totale, effective, prévue, difficulté) avec correction de la durée prévue en un tap (durée mesurée proposée en premier, puis des durées courantes) et de la difficulté perçue ; la difficulté réelle ressentie se saisit mais n'est pas encore conservée. Résumé en bas de page et retour à l'accueil ; si aucune tâche n'a abouti, l'écran propose de relancer la liste depuis le début.
- **Déploiement** : configuration wrangler pour servir la build en assets statiques sur Cloudflare (mode SPA).

## Prochaines étapes

- [x] Scaffolder le projet (Vite + React + TypeScript)
- [x] Définir le modèle de données des tâches (schéma IndexedDB)
- [x] Construire l'écran de configuration (CRUD tâches + liste prédéfinie)
- [x] Construire l'écran de création de liste manuelle (sélection, tri par glisser-déposer — sans génération automatique pour le MVP)
- [x] Construire l'écran d'exécution plein écran (tap/swipe, chronomètre, timeline d'actions)
- [x] Construire l'écran de débriefing (temps prévu vs réel, mise à jour des estimations)
- [ ] Rendre l'app installable en PWA (manifest, service worker)
- [ ] Une fois le MVP validé : écran de génération filtrée/optimisée, historique des sessions, planification

## Nice to have

Idées hors MVP, à prioriser plus tard.

### UI/UX

- [ ] Pouvoir associer un code couleur aux pièces
- [ ] Pouvoir ajouter un emoji aux pièces

## Licence

MIT — voir [`LICENSE`](LICENSE).
