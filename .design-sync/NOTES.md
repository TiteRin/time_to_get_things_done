# design-sync notes for TTGTD's UI component library

This repo has no separate published package for its UI kit - the 8 components
under `src/components/ui/` ship as part of the app. The storybook shape's
converter expects a real dist entry (`resolveDistEntry` is called *without*
`soft: true` for the storybook shape), so a few things are wired by hand:

- **`.design-sync/entry.ts`** (`cfg.entry`) - a hand-written barrel that
  `export * from`s each of the 8 real component files. This stands in for a
  published dist entry. Keep it in sync when a component is added/removed
  from `src/components/ui/`.
- **`.design-sync/package.json`** - a tiny synthetic `{name, version, types}`
  so the converter's directory walk (which looks for the nearest
  `package.json` with a `name`, starting from `entry.ts`'s directory) stops
  at `.design-sync/` instead of picking up the real repo-root `package.json`
  (which has no `types` field and would leave `exportedNames()` empty -
  0 components synced, every storybook title dropped as `[TITLE_UNMAPPED]`).
- **`.design-sync/.types/`** (gitignored, regenerated) - a real `.d.ts` tree
  for `entry.ts`, emitted via `.design-sync/tsconfig.emit-types.json`
  (`npx tsc -p .design-sync/tsconfig.emit-types.json`, `--declaration
  --emitDeclarationOnly`). **Regenerate this before every rebuild** (build
  script below) - `.design-sync/package.json`'s `types` field points into it,
  and without it `exportedNames()` is empty again. Needed `rootDir: ".."`
  and `ignoreDeprecations: "6.0"` (TS 6+ deprecates bare `baseUrl`) to emit
  cleanly; output lands at `.design-sync/.types/.design-sync/entry.d.ts` with
  the real component `.d.ts` files under `.design-sync/.types/src/...`.
- **`cfg.buildCmd`** (for re-syncs / the driver): run this before
  `package-build.mjs`:
  ```
  npx tsc -p .design-sync/tsconfig.emit-types.json
  ```

## [GENERAL] tsconfig-paths plugin chokes on `"@/*"` in a commented tsconfig

`lib/bundle.mjs`'s `tsconfigPathsPlugin` strips `/* ... */` comments with a
regex (`/\/\*[\s\S]*?\*\//g`) before `JSON.parse`. The repo's real
`tsconfig.app.json` has `"paths": { "@/*": ["./src/*"] }` - the literal `/*`
inside the `"@/*"` string is itself matched as a comment-start, and the
non-greedy scan then eats everything up to the NEXT real `*/` in the file
(here, the closing of `/* Bundler mode */` two comment blocks later),
corrupting the JSON (`paths` and everything between silently disappears).
**Fix used here**: point `cfg.tsconfig` at a small, comment-free shim,
`.design-sync/tsconfig-paths.json`, that only declares the alias:
```json
{ "compilerOptions": { "baseUrl": "..", "paths": { "@/*": ["./src/*"] } } }
```
(`baseUrl: ".."` because the shim lives one level under repo root, in
`.design-sync/`.) Do NOT repoint `cfg.tsconfig` at the real
`tsconfig.app.json`/`tsconfig.json` while either still has both a `"@/*"`
(or similarly-globbed) paths entry AND a real block comment later in the
file - it will silently drop the paths mapping again. **This looks like a
genuine bug in the bundled skill script**, not something specific to this
repo's tsconfig shape; worth reporting upstream.

## GroupedTaskList: viewport override needed for the "With Row Actions" story

`cfg.overrides.GroupedTaskList.viewport = "900x900"`. Without it, `compare.mjs`
fell back to a fixed 900x700 viewport screenshot for the DS side of the "With
Row Actions" story (9 rows across 4 room groups - taller than 700px), while
the storybook side captures the full element regardless of viewport height.
Result: the DS screenshot was cut off after the "Aucune pièce" group header,
missing its two rows, even though the live preview renders everything
correctly (confirmed by opening the html and by `render-check` passing
clean). This is a **compare-capture measurement artifact**, not a real
preview defect - the fix just gives both sides a tall enough viewport so the
`dsPage.screenshot({fullPage:false})` fallback path doesn't clip. Re-check
this if a room gets more tasks in the fixtures/stories.

## [GENERAL] Known render warns: focus ring after play() interactions

Storybook auto-runs each story's `play()` function; when the play function
does a `userEvent.click(...)` (as most of this DS's interaction stories do),
the clicked element is left focused and storybook's reference screenshot
shows the browser's native focus ring. The compiled preview only mounts the
story statically (`ReactDOM.createRoot(...).render(...)`) - it never invokes
`play()` - so no focus ring appears there. Graded `close` (per the rubric,
"focus ring" is explicitly listed as an acceptable close-not-match delta),
not fixed further: there's no config knob to replay `play()` in the static
preview capture.
- Affected so far: `TapToggle` / `Idle`, `TaskItem` / `Tappable`.
- Any OTHER story with a `play()` that ends on a `userEvent.click`/`.focus()`
  will likely show the same cosmetic delta - grade it `close` with this same
  note rather than re-diagnosing.

## Preview decorators didn't bundle (`.storybook/preview.tsx`)

`! preview decorator bundle failed: Could not resolve "tailwindcss"` - the
decorator bundle pass tries to esbuild `.storybook/preview.tsx`, which
imports `'../src/index.css'` (containing `@import 'tailwindcss'`); esbuild's
default CSS-import resolution doesn't handle the npm-package `@import` the
way `@tailwindcss/vite` does. Effect: previews don't get
`withThemeByClassName`'s `.dark` class toggle - every preview renders in the
light theme ("clair", storybook's `defaultTheme`). Since storybook's own
default-rendered stories are ALSO captured in the light theme (no dark
toggle applied at capture time), both sides are consistent - not treated as
a defect. Not worth chasing `cfg.provider` for this: the app's real
`ThemeProvider` (a different mechanism, resolved from `localStorage`/
`prefers-color-scheme` in production, mounted in `main.tsx`) isn't what
storybook uses anyway - `withThemeByClassName` just toggles a class, no
provider/context is missing from the components themselves.

## Re-sync risks

- The whole `.design-sync/entry.ts` / `.design-sync/package.json` /
  `.design-sync/.types/` scaffold above is hand-maintained, not
  auto-derived: adding a new component to `src/components/ui/` needs a new
  `export * from` line in `entry.ts`, or it never reaches the design agent
  even if it has a `UI/<Name>` story.
- The `tsconfig-paths.json` shim only declares `@/*`. If the UI components
  start using a different alias, add it there too (not to the real
  tsconfig files, per the bug above).
- Only 8 components/68 stories exist today - the `[STORY_CAP]`/fan-out
  machinery was never exercised. If the UI kit grows past ~20 components,
  follow the storybook SKILL's §4b/§4c fan-out guidance instead of grading
  everything solo.
- `docs: 0/8 components matched` is expected - there's no separate
  `docs/`/`.mdx` tree; every `.prompt.md` is synthesized from the `.d.ts` +
  JSDoc + the story-derived preview. Fine as-is.
