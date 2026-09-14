# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

Scaffolded on 2026-09-14. First delivered slice: the **Exécution** screen (TDD), fed by hard-coded fixtures, ending on a placeholder end screen that dumps the raw timeline. Configuration, Débriefing, persistence and PWA manifest/service worker are not built yet.

## Commands

- `npm run dev` — Vite dev server
- `npm test` — Vitest watch mode, three projects: `units` and `integration` (jsdom) and `storybook` (every story rendered in headless Chromium, `play` functions run as tests)
- `npm run test:run` — all Vitest projects once; `npm run test:units` / `test:integration` / `test:stories` for one project; `npx vitest run tests/units/domain/session.test.ts` for a single file
- `npm run test:e2e` — Playwright (`tests/e2e/`), projects `pixel-7` and `iphone-14`; starts the dev server itself
- The first Vitest run after a config/dependency change can fail with "Failed to connect to the browser session" (Vite re-optimizing deps); rerun it.
- `npm run storybook` — Storybook on port 6006 (default viewport iPhone 14)
- `npm run build` — `tsc -b` + Vite build
- `npm run lint` — oxlint; `npm run format` — Prettier (Markdown files are ignored)

WebKit is not installed (needs system libs: `sudo npx playwright install-deps webkit`), so the `iphone-14` Playwright project runs on Chromium.

## Workflow

TDD: write the failing test first (Vitest for logic/hooks/components, a story per visual state, Playwright for user flows), then implement.

## Architecture

Source is organized by technical kind (not by feature); add new top-level folders under `src/` as needs arise. Import across folders with the `@/` alias (→ `src/`), relative imports only within the same folder.

- `src/domain/` — pure TypeScript, no React. `session.ts` is the execution state machine: `createSession`, `sessionReducer` (events carry an injected `at` timestamp — never call `Date.now()` in the reducer), and `actualDurationMs` (running time per task, for the future Débriefing). Invalid transitions return the same state object.
- `src/hooks/` — `useSession` (wraps the reducer, injects the clock, `toggle` maps idle/running/paused to START/PAUSE/RESUME), `useSwipe` (pointer-event swipe-up detection that swallows the trailing click).
- `src/components/` — presentational components (`ExecutionScreen`, `TopMenu`, `SessionEndScreen`) that take props + callbacks only.
- `src/app/App.tsx` — wires `useSession` to the screens and switches to the end screen when the session is `ended`.

### Tests layout

Tests never live next to source. They sit under `tests/<kind>/` and mirror the path of the file under test inside `src/`:

- `tests/units/<path>.test.ts(x)` — one file under test, e.g. `src/hooks/useSwipe.ts` → `tests/units/hooks/useSwipe.test.tsx`
- `tests/integration/<path>.test.tsx` — several real modules wired together, e.g. `tests/integration/app/App.test.tsx`
- `tests/stories/<path>.stories.tsx` — Storybook stories, e.g. `tests/stories/components/ExecutionScreen.stories.tsx`
- `tests/e2e/*.spec.ts` — Playwright user flows
- `tests/setup.ts` — shared jsdom setup (jest-dom matchers, cleanup)
- `src/fixtures/tasks.ts` — sample chores from the brief, used until the Configuration screen exists.
- Styling: Tailwind v4 (`@tailwindcss/vite`), imported in `src/index.css` (also loaded by `.storybook/preview.tsx`).
- E2E tests use `page.clock.install` + `pauseAt` so timeline timestamps are deterministic.

## Execution semantics (decided)

- Center tap: start / pause / resume. The elapsed time is never displayed.
- Bottom tap or swipe up: current task is **done** (`complete` entry, even if never started), next task starts idle and waits for a tap. On the last task it ends the session.
- Top tap: menu with **Terminer** (end session → end screen) and **Annuler** (close menu). The menu does not pause the timer; swipes are disabled while it is open.
- No session persistence: reloading loses the session.

## Project overview

**Time To Get Things Done (TTGTD)** helps people start and get through household chores when executive dysfunction gets in the way — trouble initiating tasks, poor sense of how long something will actually take, and getting side-tracked mid-chore. Full context and the original product draft live in `.docs/BRIEF.md` — read it for the reasoning behind each screen.

## Product decisions (locked in)

- **Stack**: PWA — React + Vite, installable on mobile. Single codebase, no native app store distribution.
- **Persistence**: 100% local (IndexedDB/localStorage) for the MVP. No backend, no auth, no cross-device sync.
- **UI language**: French (primary target users are French-speaking). Code identifiers and comments follow standard English convention.
- **Git**: commit messages in French, Conventional Commits format (concise one-line subject, optional bullet points below). One branch per feature.

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
