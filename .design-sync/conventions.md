## Using this design system

**No wrapper needed.** None of these 8 components require a provider or root
wrapper to render or to pick up styling - just import from the bundle and
use them directly. Theme (light/dark) is driven purely by whether the
ancestor tree has a `.dark` class; there's no ThemeProvider to add, no
context to satisfy.

**Styling idiom: semantic Tailwind color tokens, never raw palette
colors.** Every component is styled with Tailwind utility classes built on
these CSS custom properties (defined in the shipped stylesheet, redefined
under `.dark`) - use these names, not `bg-red-500`/`text-gray-700`/etc.:

| Token | Use for |
|---|---|
| `background` | page/screen background |
| `surface` / `surface-alt` | cards, rows, secondary surfaces |
| `foreground` | primary text |
| `muted-foreground` | secondary/hint text |
| `border` | dividers, outlines, secondary-button borders |
| `accent` / `accent-foreground` | the brand color and the text/icon color that sits on it (primary buttons, selected states) |
| `accent-secondary` | a second brand accent (e.g. dark-mode swaps warm accent for the clay tone) |
| `danger` | destructive/error states |

Compose them as `bg-<token>`, `text-<token>`, `border-<token>` (Tailwind v4
arbitrary-property syntax against the `@theme` block) - e.g. a primary
action reuses the same pair `Button` uses: `bg-accent text-accent-foreground`.
Build new layout/glue with these tokens, never introduce a new raw color.

**Where the truth lives.** Read `styles.css` (and what it `@import`s,
including `_ds_bundle.css`) for the full token list and any component CSS
before styling something new. Each component's own `.prompt.md` next to its
card documents its specific props and states.

**Idiomatic example** - a primary action next to a secondary one, the same
pairing `ActionOverlay`'s confirmation menu uses:

```jsx
<div className="flex flex-col gap-2 bg-background p-4">
  <Button variant="secondary">Annuler</Button>
  <Button variant="primary">Continuer</Button>
</div>
```
