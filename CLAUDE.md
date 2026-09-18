# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

Scaffolded on 2026-09-14. Delivered: the **Exécution** screen, the **Configuration** screen (Dexie persistence), the manual **Génération** screen (`feat/generation`): two steps (selection then drag-and-drop ordering via dnd-kit), last list saved to localStorage (`src/storage/lastList.ts`) and re-selected on the next visit; Démarrer navigates to `/execution`, which runs the saved list and redirects to `/generation` when it is empty. A **light/dark theme** (`feat/theme-clair-sombre`): semantic color tokens (`@theme` block in `src/index.css`, `.dark` class overrides) built from a brand palette (thistle/sunlit-clay/cherry-rose) plus a hue-matched neutral scale; `ThemeProvider` (`src/app/ThemeProvider.tsx`, mounted in `main.tsx`) resolves the theme from a manual override (`src/storage/theme.ts`, localStorage) or falls back to `prefers-color-scheme`, applied via an inline anti-flash script in `index.html`; `ThemeToggle` is reachable from every screen (inside `TopMenu` on Exécution, inline elsewhere). And **mode chrono** (`feat/chrono`): `/` is a home screen with two entry points — "Générer une liste" (`/generation`) and "Chronométrer une tâche" (`/chrono`). The chrono flow picks a single task (`TaskPicker`), runs it through the same `sessionReducer` as Exécution but — unlike Exécution — displays the live elapsed time (`ChronoScreen`), then offers to replace the task's `expectedDuration` with either the total wall-clock time or the effective time excluding pauses, plus update its perceived difficulty (`ChronoSaveScreen`). Minutes are rounded up from milliseconds (`src/domain/duration.ts`), floored at 1 once something was timed. And a **UI component library** (`feat/bibliotheque-composants-ui`, `src/components/ui/`, documented in Storybook under `UI/`). The **Débriefing** screen (`feat/debriefing`) replaces the old end screen when the session ends. The PWA manifest/service worker is not built yet.

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

## PR automation

Three GitHub Actions workflows run alongside `.github/workflows/ci.yml`, using the Claude GitHub App (`anthropics/claude-code-action`):

- `claude-review.yml` (on PR opened/synchronize/reopened) — Claude reviews the diff against this file's conventions and posts findings as a PR comment. **Advisory only**: it never approves or blocks the merge.
- `ci-watch.yml` (on the `CI` workflow completing) — if CI failed, Claude reads the failing job's logs and posts a diagnosis + suggested fix as a comment (it never pushes a commit or edits files); if CI passed, it posts a plain "ready to merge, reply `/merge`" comment.
- `merge-on-command.yml` (on an `/merge` comment from the repo owner/a member/collaborator) — deterministically re-checks the PR's status checks and squash-merges if they're green, no LLM involved.

Merging is never autonomous: a human always types `/merge`. Setup prerequisites (one-time, repo admin): install https://github.com/apps/claude on this repo, and add a repo secret named either `ANTHROPIC_API_KEY` or `CLAUDE_CODE_OAUTH_TOKEN` (not both) under Settings → Secrets and variables → Actions.

## Architecture

Source is organized by technical kind (not by feature); add new top-level folders under `src/` as needs arise. Import across folders with the `@/` alias (→ `src/`), relative imports only within the same folder.

- `src/domain/` — pure TypeScript, no React. `session.ts` is the execution state machine: `createSession`, `sessionReducer` (events carry an injected `at` timestamp — never call `Date.now()` in the reducer), and `actualDurationMs` (running time per task). Invalid transitions return the same state object.
- `src/domain/debriefing.ts` — `timelineSegments` cuts the timeline into `work` / `pause` / `wait` segments (ms since the first event; each gap belongs to the task of the event closing it), `taskDurations` (total = work + pause, effective = work; waits never count), `sessionSummary` (a task is **done** only if it has both `start` and `complete`; elapsed = first → last event), `formatDuration`.
- `src/hooks/` — `useSession` (wraps the reducer, injects the clock, `toggle` maps idle/running/paused to START/PAUSE/RESUME), `useSwipe` (pointer-event swipe-up detection that swallows the trailing click).
- `src/components/` — presentational components (`ExecutionScreen`, `TopMenu`, `DebriefingScreen`, `TaskDebriefSheet`) that take props + callbacks only.
- `src/components/ui/` — the component library screens are built from: `Button` (`primary`/`secondary` × `sm`/`md`/`lg`; `buttonClassName()` for non-button look-alikes such as layout placeholders), `Chip` (toggle pill), `TapToggle` + `StatusHint` (start/pause/resume zone and its hint, shared by Exécution and Chrono), `ScreenHeader`, `GroupedTaskList` (tasks by room, row content via `renderRow`), `TaskItem` (a task row: name, details line, `leading`/`trailing` controls, or wholly tappable via `onClick`), `ActionOverlay` (full-screen menu or confirmation). Reach for these before writing Tailwind for a button, a header, a room-grouped list or an overlay; styling that repeats on a second screen belongs here. Class strings are plain template literals (no clsx/cva); an optional `className` is appended for layout only. Each one has a unit test and a story with `tags: ['autodocs']` (title `UI/…`), with its props documented by JSDoc, which feeds the Docs page. `tests/helpers/uiStory.tsx` provides the themed story backdrop (full height on the canvas, compact on Docs).
- `src/app/App.tsx` — routes (`/` accueil, `/generation`, `/chrono`, `/execution`, `/configuration`); `src/pages/ExecutionPage.tsx` wires `useSession` to the screens and switches to the debriefing when the session is `ended`.
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

## Débriefing semantics (decided)

- The timeline is one block per task (`timelineBlocks`), mid-task pauses hatched **inside** it; the wait before a task's first tap stays a separate hatched block. Both are excluded from effective time, and only started tasks have clickable blocks.
- The vertical axis shows delays since the first event (`formatOffset`, `T0` / `+4 min`), at the start and end of every block and pause; a label closer than 18 px to the previous one is dropped.
- Editing the expected duration is one tap: the measured duration is offered first, then the `DurationPicker` presets; it is saved with `updateTask`, and so is the perceived difficulty. The **actual** difficulty felt is kept in screen state only, until a session history exists.
- A session where nothing was completed shows "Aucune tâche effectuée" and a **Relancer** button (`RESTART` rebuilds the session from the same tasks) instead of the congratulations.
- `ExecutionPage` feeds the debriefing with the stored version of each session task (live query) so edits show up at once.

## Project overview

**Time To Get Things Done (TTGTD)** helps people start and get through household chores when executive dysfunction gets in the way — trouble initiating tasks, poor sense of how long something will actually take, and getting side-tracked mid-chore. Full context and the original product draft live in `.docs/BRIEF.md` — read it for the reasoning behind each screen.

## Product decisions (locked in)

- **Stack**: PWA — React + Vite, installable on mobile. Single codebase, no native app store distribution.
- **Persistence**: 100% local (IndexedDB/localStorage) for the MVP. No backend, no auth, no cross-device sync.
- **UI language**: French (primary target users are French-speaking). Code identifiers and comments follow standard English convention.
- **Git**: commit messages in French, Conventional Commits format (concise one-line subject, optional bullet points below). One branch per feature. No AI attribution: no `Co-Authored-By: Claude` trailer in commits, no "Generated with Claude Code" line in PR descriptions.

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
