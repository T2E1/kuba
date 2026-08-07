# Main

The body of a page: one centered column, capped at a readable width, padded,
with a consistent gap between its children, and tall enough to push a footer to
the bottom of short pages. The third piece of the page frame — `<kb-header>` on
top, `kb-main` between, `<kb-footer>` below.

```html preview
<kb-main>
  <kb-text size="lg" weight="bold">Page title</kb-text>
  <kb-text size="xs">Direct children stack vertically with the built-in gap.</kb-text>
  <kb-card>
    <kb-text size="xxs">No extra wrapper needed.</kb-text>
  </kb-card>
</kb-main>
```

## Usage

```html
<kb-main role="main">
  <h1>Page title</h1>
  <p>Page content.</p>
</kb-main>
```

## When to use

- **The content region of a page**, once per page, between the header and the
  footer.
- **Any screen that should stay readable on a wide monitor** — the width cap
  keeps line length in range without a wrapper of your own.
- **Pages whose content is short** — the minimum height keeps the footer at the
  bottom of the viewport instead of floating mid-screen.

## When not to use

- **A section inside the page.** This is the page's `main` region and there's
  only one per page. Group a section with `<kb-stack>` or `<kb-card>`.
- **A full-bleed layout.** The column is capped and centered by design. Content
  that must span the viewport goes outside it, or escapes the padding with
  `<kb-inset>`.
- **A two-column layout.** This is a single flex column; nest a `<kb-stack
  direction="row">` inside it for side-by-side regions.

## Composition

- **Can contain**: anything — the shadow root is a single unnamed `<slot>`.
  Children stack vertically with the gap between them, so most pages need no
  extra wrapper: sections, cards and headings can be direct children.
- **Can be a child of**: the page root, typically `<body>`. It centers itself
  and takes 100% of the available width up to its cap.

## The page frame

The default minimum height is `calc(100svh - 144px)`, where 144px is the 72px of
`<kb-header>` plus the 72px of `<kb-footer>`. That's what makes a nearly empty
page still fill the viewport, with the footer resting at the bottom rather than
climbing into the middle.

Change any of the three heights and they must change together — a taller header
with the default offset leaves the page scrolling by exactly the difference:

```css
:root {
  --header-size-height: 96px;
  --footer-size-height: 96px;
}

kb-main {
  --main-size-offset: 192px; /* 96 + 96 */
}
```

Pages without a header or footer should reduce the offset to `0px`, not keep the
default.

## Attributes

This element has no attributes and dispatches no events.

## Styling

| Custom property | Default | Controls |
|---|---|---|
| `--main-size-max-width` | `480px` | Cap on the content column. |
| `--main-space-inset` | `var(--spacing_inset-xs)` | Padding around the column. |
| `--main-space-gap` | `var(--spacing_inset-md)` | Vertical gap between direct children. |
| `--main-size-offset` | `144px` | Height subtracted from the viewport for the minimum height — the header plus footer. |

The 480px default is a single-column, mobile-first measure. A dense desktop app
pairing `kb-main` with `<kb-header>` usually wants the column to match the
header's own 1024px row:

```html preview
<div style="--main-size-max-width: 720px; --main-space-gap: 16px; --main-size-offset: 0px;">
  <kb-main>
    <kb-text size="xs">A wider column, with a tighter gap.</kb-text>
    <kb-text size="xs">Offset zeroed, since there's no header or footer here.</kb-text>
  </kb-main>
</div>
```

## States and accessibility

- `kb-main` has no `hidden` attribute and no custom states.
- **The element does not render a native `<main>`** — its shadow root is just a
  slot, so it exposes no `main` landmark on its own. Add the role on the host
  (`<kb-main role="main">`) or wrap the page content in a real `<main>`, so
  "skip to content" works.
- Keep one per page. Two content regions make the landmark ambiguous, the same
  way two `<kb-header>`s would.
- The width cap is what keeps line length readable; overriding it far beyond
  ~75 characters of text trades readability for density.

## Do's and don'ts

| Do | Don't |
|---|---|
| Use exactly one `kb-main` per page | Nest one inside another, or reuse it per section |
| Keep `--main-size-offset` in sync with the bar heights | Change the bars and leave the offset at 144px |
| Let direct children inherit the built-in gap | Add margins to children to recreate spacing the column provides |
| Add `role="main"` (or wrap in `<main>`) for the landmark | Assume the element name alone conveys the landmark |
