# Footer

The closing bar of a page: a strip that fills the width it's given and pins one
group of content to the start of a centered row (`leading`) and another to its
end (`trailing`). It's a page-level landmark, not a generic container — no
attributes, no events, and no default slot, so anything not assigned to
`leading` or `trailing` is dropped.

```html preview
<kb-footer>
  <kb-text slot="leading" size="xxxs">© 2026 Your Company</kb-text>
  <kb-text slot="trailing" size="xxxs">Privacy Policy</kb-text>
</kb-footer>
```

## Usage

```html
<kb-footer>
  <kb-text slot="leading" size="xxxs">© 2026 Your Company</kb-text>
  <kb-text slot="trailing" size="xxxs">Terms</kb-text>
</kb-footer>
```

## When to use

- **Closing a page** with the legal or secondary content that belongs at the
  very bottom — copyright line, privacy and terms links, locale switcher.
- **Pairing with `<kb-header>`** so a page opens and closes with the same
  centered 1024px column and the same 72px bar height.

## When not to use

- **The top bar of the page** — use `<kb-header>`, the same centered-row
  primitive, which lays its regions out as flex rows and is the matching
  landmark for that end.
- **A footer inside a card, dialog or section.** The host publishes the
  `contentinfo` landmark, which belongs to the page — use a `<kb-stack>` for
  the action row at the bottom of a contained surface.
- **Grouping arbitrary content into two columns** — use `<kb-stack>` or a
  `<kb-card direction="row">`. This fixes the height and the max width.

## Composition

- **Can contain**: anything carrying `slot="leading"` or `slot="trailing"`. The
  element renders only those two named slots and no default slot, so unslotted
  children never appear. Typical content is `<kb-text>` for the copyright line
  and `<kb-button variant="link">` or `<a>` for secondary links.
- **Can be a child of**: anything. The bar fills 100% of whatever width it's
  given and only caps its inner row, so it adapts to a narrower container
  instead of overflowing it. Semantically it still belongs at the page root.

Each slot's wrapper lays its children out as a flex row, same as
`<kb-header>`. Two elements slotted into the same region already come spaced
apart, so plain elements are enough — no `<kb-stack>` needed.

```html preview
<kb-footer>
  <kb-text slot="leading" size="xxxs">© 2026 Your Company</kb-text>
  <kb-button slot="trailing" variant="link">Privacy</kb-button>
  <kb-button slot="trailing" variant="link">Terms</kb-button>
</kb-footer>
```

## Content

Neither slot has default content. `leading` and `trailing` stay empty until you
slot something into them.

```html preview
<kb-footer>
  <kb-text slot="trailing" size="xxxs">Only trailing is filled</kb-text>
</kb-footer>
```

Keep both sides short — the bar is a fixed 72px tall and doesn't grow, so
content that wraps will overflow it rather than push it taller.

## Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `alt` | `string` | `''` | Accessible name for the landmark, for pages that carry more than one. |

It dispatches no events; the rest of its surface is the pair of named slots.

## Styling

| Custom property | Default | Controls |
|---|---|---|
| `--footer-size-height` | `72px` | Height of the bar, on both the host and the inner centered row. |
| `--footer-size-max-width` | `1024px` | Cap on the centered content row; below it, the row follows the bar's width. |
| `--footer-space-inset` | `var(--spacing_inset-xs)` | Inner padding of the centered row. |
| `--footer-space-gap` | `var(--spacing_inset-xs)` | Gap between elements slotted into the same region. |

`kb-footer` paints no background of its own, so the page background shows
through — set `background-color` directly when the bar needs to read as a
separate surface:

```html preview
<div style="--footer-size-height: 96px;">
  <kb-footer style="background-color: var(--color-master-lighter)">
    <kb-text slot="leading" size="xxxs">A taller, tinted bar</kb-text>
    <kb-text slot="trailing" size="xxxs">Contact</kb-text>
  </kb-footer>
</div>
```

## States and accessibility

- `kb-footer` has no `hidden` *property* and no custom states — the native
  `hidden` global attribute still works (the browser's own stylesheet hides
  any element with it), but there's no `:host(:state(hidden))` to style.
  Remove the element itself when the bar shouldn't be in the layout.
- The host carries the `contentinfo` landmark, published through
  `ElementInternals`. The shadow wrapper is deliberately non-semantic: a
  `<footer>` there would map to `contentinfo` too, leaving two nested landmarks.
- Use a single `kb-footer` per page; a second splits that landmark and makes
  "jump to page footer" ambiguous.
- The element adds no focus management, so slotted links and buttons keep their
  native focus order — keep them in the reading order you want, `leading` first.

## Do's and don'ts

| Do | Don't |
|---|---|
| Slot your own copyright line into `leading` | Leave `leading` empty and expect a copyright line to appear |
| Keep a single `kb-footer`, at the page root | Reuse it as the bottom bar of a card or dialog |
| Slot several elements side by side and let the region space them | Wrap them in a `<kb-stack direction="row">` — the region already lays them out as a flex row |
| Keep both sides to a single short line | Fill the bar with content that wraps — the 72px height is fixed |
