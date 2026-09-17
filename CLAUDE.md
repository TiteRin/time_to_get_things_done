# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

Scaffolded on 2026-09-14. Delivered: the **Exécution** screen (placeholder end screen dumping the raw timeline), the **Configuration** screen (Dexie persistence), and the manual **Génération** screen (`feat/generation`): the root route, two steps (selection then drag-and-drop ordering via dnd-kit), last list saved to localStorage (`src/storage/lastList.ts`) and re-selected on the next visit; Démarrer navigates to `/execution`, which runs the saved list and redirects to `/` when it is empty. And a **light/dark theme** (`feat/theme-clair-sombre`): semantic color tokens (`@theme` block in `src/index.css`, `.dark` class overrides) built from a brand palette (thistle/sunlit-clay/cherry-rose) plus a hue-matched neutral scale; `ThemeProvider` (`src/app/ThemeProvider.tsx`, mounted in `main.tsx`) resolves the theme from a manual override (`src/storage/theme.ts`, localStorage) or falls back to `prefers-color-scheme`, applied via an inline anti-flash script in `index.html`; `ThemeToggle` is reachable from every screen (inside `TopMenu` on Exécution, inline elsewhere). Débriefing and PWA manifest/service worker are not built yet.

## Commands

- `npm run dev` — Vite dev server
- `npm test` — Vitest watch mode, three projects: `units` and `integration` (jsdom) and `storybook` (every story rendered in headless Chromium, `play` functions run as tests)
- `npm run test:run` — all Vitest projects once; `npm run test:units` / `test:integration` / `test:stories` for one project; `npx vitest run tests/units/domain/session.test.ts` for a single file
- `npm run test:e2e` — Playwright (`tests/e2e/`), projects `pixel-7` and `iphone-14`; builds the app and serves it with `vite preview` (**not** the dev server: Vite's dependency pre-bundling triggers a full page reload mid-test that wipes the React state)
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
- `src/catalog/defaultCatalog.ts` — starter catalogue (task names + rooms, no equipment) copied into the user's database once, on first launch. Changing it only affects new users; existing copies are never touched.
- `src/db/database.ts` — `TtgtdDatabase` (Dexie): `tasks`, `rooms`, `equipment` tables, seeded from the catalogue in the `populate` hook. Schema changes need a new `version()`. Unit tests use `fake-indexeddb` (loaded in `tests/setup.ts`) with a random database name per test.
- **Id strategy**: catalogue entities use readable slugs (`cuisine-passer-le-balai`); everything the user creates gets `crypto.randomUUID()`. Never derive user ids from names.
- `src/domain/` validation: `normalizeTask` (name required, duration a positive integer, equipment deduplicated, cleared fields dropped rather than stored as `undefined`) and `normalizeName` throw `ValidationError` with a French, user-facing message; anything else thrown is unexpected. `byName` sorts French-style (case/accent-insensitive, natural numbers).
- `src/repositories/` — plain async functions taking the database first: `taskRepository` (`listTasks`, `createTask`, `updateTask` = full replace, `deleteTask`), `roomRepository` / `equipmentRepository` (`list…`, `findOrCreate…` deduplicating by name ignoring case and accents), built on `namedEntityRepository`.
- `src/db/DatabaseProvider.tsx` + `src/hooks/useDatabase.ts` — the database is injected through context (tests and stories pass an isolated one; `useDatabase` throws outside a provider). Data hooks (`useTasks`, …) use `useLiveQuery`: the list is `undefined` while loading, and they expose the bound repository actions. Test helpers: `setupTestDatabases()` and `databaseWrapper(db)` in `tests/helpers/testDatabase.tsx`.
- `src/app/ThemeProvider.tsx` + `src/hooks/useTheme.ts` — resolves `light`/`dark` from a manual override (`src/storage/theme.ts`, localStorage) or `prefers-color-scheme`, applies the `.dark` class to `<html>`. Unlike `DatabaseContext`, `ThemeContext` (`src/app/themeContext.ts`) has a real default value instead of throwing outside a provider, so `ThemeToggle` can be embedded in components with existing provider-less tests/stories (`TopMenu`, …). Mounted in `main.tsx`, not `App.tsx`, so `App.test.tsx` doesn't need a `matchMedia` stub.

### Tests layout

Tests never live next to source. They sit under `tests/<kind>/` and mirror the path of the file under test inside `src/`:

- `tests/units/<path>.test.ts(x)` — one file under test, e.g. `src/hooks/useSwipe.ts` → `tests/units/hooks/useSwipe.test.tsx`
- `tests/integration/<path>.test.tsx` — several real modules wired together, e.g. `tests/integration/app/App.test.tsx`
- `tests/stories/<path>.stories.tsx` — Storybook stories, e.g. `tests/stories/components/ExecutionScreen.stories.tsx`
- `tests/e2e/*.spec.ts` — Playwright user flows
- `tests/setup.ts` — shared jsdom setup (jest-dom matchers, cleanup, working localStorage shim — Node 25's broken global shadows jsdom's — cleared after each test)
- `src/fixtures/tasks.ts` — sample chores, now only used by stories.
- Styling: Tailwind v4 (`@tailwindcss/vite`), imported in `src/index.css` (also loaded by `.storybook/preview.tsx`).
- E2E tests control time with `page.clock.setFixedTime` only: `clock.install`'s frozen timers stall Dexie's queries, so the screen never loads.
- Pages must not render their content before every `useLiveQuery` they use has resolved (`!tasks || !rooms` → render nothing): rendering with partial data regroups the list when the rest arrives, swapping DOM nodes and losing taps.

## Execution semantics (decided)

- Center tap: start / pause / resume. The elapsed time is never displayed.
- Bottom tap or swipe up: current task is **done** (`complete` entry, even if never started), next task starts idle and waits for a tap. On the last task it ends the session.
- Top tap: menu with **Terminer** (end session → end screen), **Annuler** (close menu) and a **Configuration** link. The menu does not pause the timer; swipes are disabled while it is open.
- No session persistence: reloading loses the session.

## Project overview

**Time To Get Things Done (TTGTD)** helps people start and get through household chores when executive dysfunction gets in the way — trouble initiating tasks, poor sense of how long something will actually take, and getting side-tracked mid-chore. Full context and the original product draft live in `.docs/BRIEF.md` — read it for the reasoning behind each screen.

## Product decisions (locked in)

- **Stack**: PWA — React + Vite, installable on mobile. Single codebase, no native app store distribution.
- **Persistence**: 100% local (IndexedDB/localStorage) for the MVP. No backend, no auth, no cross-device sync.
- **UI language**: French (primary target users are French-speaking). Code identifiers and comments follow standard English convention.
- **Git**: commit messages in French, Conventional Commits format (concise one-line subject, optional bullet points below). One branch per feature.

## Domain model

A **task** (corvée, `src/domain/task.ts`) only requires a `name` — a task with just a name is usable right away; the rest is filled in whenever the user wants:
- `expectedDuration` (minutes), `perceivedDifficulty` (`easy` / `medium` / `hard`)
- `roomId` — reference to a `Room` (a task can apply to no specific room)
- `equipmentIds` — references to `Equipment` (shared equipment matters for the generation step, see below)

`Room` and `Equipment` are `{ id, name }` user-customizable lists; tasks reference them by id so renames propagate.

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
