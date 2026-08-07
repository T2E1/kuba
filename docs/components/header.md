# Header

The opening bar of a page: a strip that pins one group of content to the start
of a centered row (`leading`) and another to its end (`trailing`), laying each
region out as a flex row with a gap between its children. It's a page-level
landmark, not a generic toolbar — no attributes, no events, and no default slot,
so anything not assigned to `leading` or `trailing` is dropped.

```html preview
<kb-header>
  <kb-logo slot="leading"></kb-logo>
  <nav slot="trailing">
    <kb-button variant="link">Docs</kb-button>
    <kb-button variant="link">Guides</kb-button>
  </nav>
</kb-header>
```

## Usage

```html
<kb-header>
  <kb-logo slot="leading"></kb-logo>
  <nav slot="trailing">…</nav>
</kb-header>
```

## When to use

- **Opening a page** with the identity and navigation that belong at the very
  top — brand mark, primary nav, account menu, a search entry point.
- **Pairing with `<kb-footer>`** so a page opens and closes with the same
  centered 1024px column and the same 72px bar height.

## When not to use

- **The bottom bar of the page** — use `<kb-footer>`, the matching landmark for
  that end. It shares the centered-row geometry but leaves its slot regions
  unstyled instead of laying them out as flex rows.
- **A header inside a card, dialog or section.** This renders a native
  `<header>` at page level; a title row inside a contained surface is a
  `<kb-stack direction="row" justify="space-between">`.
- **A toolbar of actions.** The two regions anchor content to opposite ends of a
  fixed-height bar. A dense row of buttons that should wrap or scroll wants a
  `<kb-stack>`, which grows with its content.

## Composition

- **Can contain**: anything carrying `slot="leading"` or `slot="trailing"`. The
  element renders only those two named slots and no default slot, so unslotted
  children never appear. `leading` typically holds a `<kb-logo>`, optionally
  followed by a product name; `trailing` holds a `<nav>`, a `<kb-stack
  direction="row">` of link buttons, or an avatar.
- **Can be a child of**: anything, semantically the page root.

Unlike `<kb-footer>`, each region is itself a flex row with a gap, so several
elements slotted into the same side are spaced and vertically centered without
any extra wrapper.

```html preview
<kb-header>
  <kb-stack slot="leading" direction="row" align="center" spacing="nano">
    <kb-logo></kb-logo>
    <kb-text size="xxs" weight="bold">kuba</kb-text>
  </kb-stack>
  <kb-button slot="trailing" variant="icon" aria-label="Account">
    <kb-icon use="account_circle"></kb-icon>
  </kb-button>
</kb-header>
```

!> **The inner `<header>` is `100svw` wide** — it spans the viewport rather than
its container. Nesting one inside a narrower element makes it overflow that
element. `<kb-footer>` had the same behavior and was changed to fill its
container instead; this one has not been.

## Content

Both regions are empty until filled — there is no fallback content on either
slot. Keep each side to one line: the bar is a fixed 72px tall and doesn't grow,
so content that wraps overflows it rather than pushing it taller.

## Attributes

This element has no attributes and dispatches no events. Its whole surface is
the pair of named slots.

## Styling

| Custom property | Default | Controls |
|---|---|---|
| `--header-size-height` | `72px` | Height of the bar, on both the host and the inner centered row. |
| `--header-size-max-width` | `1024px` | Cap on the centered content row. |
| `--header-space-inset` | `var(--spacing_inset-xs)` | Inner padding of the centered row. |
| `--header-space-gap` | `var(--spacing_inset-xs)` | Gap between elements slotted into the same region. |

`kb-header` paints no background of its own, so the page background shows
through — set `background-color` directly when the bar needs to read as a
separate surface:

```html preview
<div style="--header-size-height: 96px; --header-space-gap: 24px;">
  <kb-header style="background-color: var(--color-master-lightest)">
    <kb-logo slot="leading"></kb-logo>
    <kb-text slot="trailing" size="xxs">A taller, tinted bar</kb-text>
  </kb-header>
</div>
```

## States and accessibility

- `kb-header` has no `hidden` attribute and no custom states — remove the
  element itself when the bar shouldn't be in the layout.
- The inner `<header>` exposes a `banner` landmark. Use a single `kb-header` per
  page; a second splits that landmark and makes "jump to page header" ambiguous.
- Wrap primary navigation in a `<nav>` inside the `trailing` slot so it gets its
  own `navigation` landmark — the header's landmark doesn't describe the links
  it contains.
- The element adds no focus management, so slotted links and buttons keep their
  native focus order: `leading` first, matching the reading order.

## Do's and don'ts

| Do | Don't |
|---|---|
| Slot the brand into `leading` and navigation into `trailing` | Leave children unslotted — without `slot=`, they never render |
| Keep a single `kb-header`, at the page root | Reuse it as the title bar of a card or dialog |
| Slot several elements into one region and let the built-in gap space them | Add a wrapper to recreate spacing the region already provides |
| Keep each side to a single short line | Fill the bar with content that wraps — the 72px height is fixed |
