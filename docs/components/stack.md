# Stack

A flex container with a token-based gap: it arranges whatever is slotted into it
in one row or one column, aligned and spaced by attribute. A layout primitive
with no surface of its own — no background, no padding, no border — so it never
looks like anything on its own.

```html preview
<kb-stack direction="row" spacing="xs">
  <kb-button>Save</kb-button>
  <kb-button variant="naked">Cancel</kb-button>
</kb-stack>
```

## Usage

```html
<kb-stack direction="column" align="stretch" spacing="nano">…</kb-stack>
```

## When to use

- **Spacing a group of siblings consistently** — a row of buttons, a column of
  fields, a toolbar — without a one-off flex rule per group.
- **Anchoring content to opposite ends** with `justify="space-between"`.
- **Grouping content inside another component's slot**, where the parent gives
  you one region and you need several elements arranged in it.

## When not to use

- **A page header or footer bar** — `<kb-header>` and `<kb-footer>` are the
  landmark versions of the same centered-row idea, with a fixed height and a max
  width. A stack has neither and exposes no landmark.
- **A visible surface** — a grouping that needs a background, padding or border
  is a `<kb-card>`.
- **A two-dimensional grid** — this is a single flex line; children never wrap.
  Use CSS Grid when rows *and* columns matter.
- **Spacing text inside a paragraph** — `<kb-text>` carries its own rhythm.

## Composition

- **Can contain**: anything. The shadow root is a single unnamed `<slot>`, so
  every child renders in source order as a flex item.
- **Can be a child of**: anything, including another `kb-stack`. Nesting a
  column of rows is the normal way to build a two-dimensional layout out of this
  primitive, since a single stack never wraps.

```html preview
<kb-stack direction="column" spacing="nano" align="stretch">
  <kb-stack direction="row" justify="space-between">
    <kb-text size="xxs" weight="bold">Total</kb-text>
    <kb-text size="xxs">R$ 240,00</kb-text>
  </kb-stack>
  <kb-button width="fill">Checkout</kb-button>
</kb-stack>
```

Because the host is the flex container, children stretch or shrink by the usual
flex rules — a child with `flex: 1` fills the leftover space.

## Direction, alignment and spacing

`direction` is the only attribute with a closed set of values. `align` and
`justify` pass through to `align-items` and `justify-content` verbatim, so any
valid CSS value works — and an invalid one silently does nothing.

| Attribute | Acts along | Common values |
|---|---|---|
| `justify` | the direction of the stack (main axis) | `flex-start`, `center`, `space-between`, `flex-end` |
| `align` | across it (cross axis) | `start`, `center`, `stretch`, `baseline` |

In a `row`, `align="center"` vertically centers items of different heights; in a
`column`, `align="stretch"` makes children fill the width. Switching `direction`
swaps which attribute does what — check both when a stack changes orientation.

```html preview
<kb-stack direction="row" justify="space-between" align="center" style="width: 100%">
  <kb-text size="xxs">Pinned left</kb-text>
  <kb-button variant="link">Pinned right</kb-button>
</kb-stack>
```

`spacing` selects a step of the inset scale, which keeps the rhythm between
groups predictable across a page:

| `spacing` | Gap | Use for |
|---|---|---|
| `quarck` / `nano` | 4 / 8px | Elements that read as one unit — icon and label, field and helper. |
| `xs` | 16px | The default: siblings inside a group. |
| `sm` / `md` | 24 / 32px | Separating groups inside a section. |
| `lg` and up | 40px+ | Section-level separation, where `<kb-inset>` may serve better. |

## Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `direction` | `row` \| `column` | `row` | Flex direction applied to the host. |
| `align` | CSS `align-items` | `start` | Cross-axis alignment. |
| `justify` | CSS `justify-content` | `flex-start` | Main-axis alignment. |
| `spacing` | token step | `xs` | Gap, resolved against `--spacing_inset-{value}`. |
| `width` | `auto` \| `fill` \| length | `auto` | Host width. |
| `height` | `auto` \| length | `auto` | Host height. |
| `hidden` | `boolean` | `false` | Removes the stack and its children from layout and the accessibility tree. |

This element dispatches no events.

## Styling

The gap is the one decision also exposed as a custom property — useful when
spacing must respond to a media query, which an attribute can't do.

| Custom property | Default | Controls |
|---|---|---|
| `--stack-space-gap` | `var(--spacing_inset-{spacing})` | Gap between children, overriding the `spacing` attribute. |

```css
@media (width < 600px) {
  kb-stack.toolbar { --stack-space-gap: var(--spacing_inset-nano); }
}
```

Everything else (`align`, `direction`, `justify`, `height`, `width`) is an
attribute applied directly to the host — set those rather than overriding the
same properties in CSS.

## States and accessibility

- `hidden` adds the `hidden` custom state and `display: none`, removing the
  stack and its children from layout and the accessibility tree.
- The element renders no landmark, no role and no label. Group semantics have to
  come from what you put inside it — a `<nav>`, a `<ul>`, a fieldset — or from
  ARIA on the host.
- Visual order follows source order, so keyboard order matches the screen. Don't
  reverse it with `flex-direction: row-reverse` from outside.

## Do's and don'ts

| Do | Don't |
|---|---|
| Pick a `spacing` step from the scale | Set a one-off pixel gap next to a scale that already fits |
| Nest stacks to build a two-dimensional layout | Expect children to wrap — a stack is a single flex line |
| Reach for `<kb-card>` when the group needs a surface | Add a background and padding to a stack to fake one |
| Keep source order equal to reading order | Reorder visually with `row-reverse` or `order` |
