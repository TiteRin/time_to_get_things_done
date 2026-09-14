# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

Greenfield as of 2026-09-14 — no code has been written yet, only this file, `LICENSE`, and `.docs/BRIEF.md`. There are no build/lint/test commands to document yet. Once the project is scaffolded, update this file with real commands and architecture notes rather than guessing at them.

## Project overview

**Time To Get Things Done (TTGTD)** helps people start and get through household chores when executive dysfunction gets in the way — trouble initiating tasks, poor sense of how long something will actually take, and getting side-tracked mid-chore. Full context and the original product draft live in `.docs/BRIEF.md` — read it for the reasoning behind each screen.

## Product decisions (locked in)

- **Stack**: PWA — React + Vite, installable on mobile. Single codebase, no native app store distribution.
- **Persistence**: 100% local (IndexedDB/localStorage) for the MVP. No backend, no auth, no cross-device sync.
- **UI language**: French (primary target users are French-speaking). Code identifiers, comments, and commit messages follow standard English convention unless the user says otherwise.

## Domain model

A **task** (corvée) has:
- `name`
- `expectedDuration`
- `perceivedDifficulty`
- `room` (optional — a task can apply to no specific room)
- `sharedEquipment` (optional — equipment shared across tasks matters for the generation step, see below)

## Screens

1. **Configuration** — CRUD on tasks. Ships with a predefined list of chore names; the user fills in duration/difficulty/room/equipment for their own use. Adding custom tasks is supported.
2. **Génération** — user picks filters (time budget, room(s), difficulty), the app pulls matching tasks and orders them to minimize room/equipment transitions. Manual add/remove/reorder after generation.
3. **Exécution** — fullscreen, one task name at a time.
   - Tap center → pause/start (starts a silent timer)
   - Tap top / swipe down → reveal Annuler / Terminer
   - Tap bottom / swipe up → next task
   - Every action (start, pause, resume, skip) is recorded into a timeline for the debrief.
4. **Débriefing** — shows the timeline with planned vs. actual time per task, offers to update the task's expected duration, and lets the user record the actual difficulty they experienced.

Not in scope yet (post-MVP, per the brief): session history screen, planning screen.

## MVP scope

- Responsive fullscreen mobile execution screen (swipe gestures are a stretch goal)
- Task configuration screen
- Manual list creation — the filtered/optimized **génération** step is explicitly deferred past MVP
