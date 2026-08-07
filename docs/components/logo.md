# Logo

The brand mark as inline SVG, sized to a square and colored from `currentColor`.
It's the mark alone — no attributes, no wordmark, no link behavior.

```html preview
<kb-logo></kb-logo>
```

## Usage

```html
<kb-logo></kb-logo>
```

## When to use

- **Identifying the product at the top of a page** — slotted into
  `<kb-header>`'s `leading` region, which is what that region is shaped for.
- **Anchoring an entry screen** — sign-in, splash, empty state, where the mark
  stands alone above the content.
- **Marking ownership in a closing bar** — next to the copyright line in
  `<kb-footer>`.

## When not to use

- **As a home link on its own.** The element renders no anchor; wrap it in an
  `<a href="/">` so the mark becomes navigable and focusable.
- **As a generic icon** — use `<kb-icon>`, which resolves any Material Symbols
  glyph by name. This renders one fixed SVG.
- **For a lockup with the product name.** This is the symbol only; put a
  `<kb-text>` beside it in a `<kb-stack>` when you need mark plus wordmark.

## Composition

- **Can contain**: no meaningful children. The shadow root renders a fixed
  `<svg>` and declares no slot, so light-DOM children never appear.
- **Can be a child of**: anything. It's a fixed-size square that neither grows
  nor shrinks with its container, so it composes predictably inside a flex row.

```html preview
<kb-stack direction="row" align="center" spacing="nano">
  <kb-logo></kb-logo>
  <kb-text size="sm" weight="bold">kuba</kb-text>
</kb-stack>
```

## Attributes

This element has no attributes and dispatches no events. Everything about it is
controlled through CSS.

## Styling

| Custom property | Default | Controls |
|---|---|---|
| `--logo-color` | `var(--color-primary)` | Stroke color. The SVG strokes with `currentColor`, so this is the host's `color`. |
| `--logo-size` | `40px` | Side of the square; height and width move together, keeping the 1:1 ratio. |

Because the mark inherits `currentColor`, a single `color` declaration on an
ancestor inverts it on a dark surface — `--logo-color` is for the case where the
mark should *not* follow the surrounding text.

```html preview
<div style="--logo-size: 64px; --logo-color: var(--color-danger);">
  <kb-logo></kb-logo>
</div>
```

## States and accessibility

- `kb-logo` has no `hidden` attribute and no custom states.
- **The inline SVG carries no `<title>` and no ARIA role**, so assistive
  technology sees an unlabelled graphic. When the mark is the only content of a
  link, put the name on the link: `<a href="/" aria-label="Home">`.
- When a visible wordmark already names the product beside it, the mark is
  decorative — `aria-hidden="true"` avoids announcing it twice.
- The mark strokes at a fixed weight relative to its canvas, so it keeps its
  proportions at any `--logo-size`; it doesn't need a separate small variant.

## Do's and don'ts

| Do | Don't |
|---|---|
| Wrap the mark in an `<a>` when it should lead home | Attach a click listener — it has no focus or link semantics |
| Let it inherit `currentColor` on inverted surfaces | Hard-code a color that breaks when the surface changes |
| Resize with `--logo-size` so the square stays square | Set `height` or `width` directly and stretch the mark |
| Label the wrapping link, or hide the mark from screen readers | Leave an unlabelled graphic as a link's only content |
