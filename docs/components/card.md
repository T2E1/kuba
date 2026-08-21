# Card

A card groups related content into one flex container, styled by `--card-*`
tokens. It's a layout primitive, not a control — it has no action of its own.
Any click, navigation, or keyboard interaction belongs entirely to the slotted
content, like a real `<kb-button>` or `<a>`, never to the card.

```html preview
<kb-card>
  <kb-text size="xs" weight="bold">Akita</kb-text>
  <kb-text size="xxxs" color="master">Docile, courageous, dignified</kb-text>
  <kb-button width="fill">Details</kb-button>
</kb-card>
```

## Usage

```html
<kb-card direction="row">
  <kb-text>Content</kb-text>
</kb-card>
```

## When to use

- **Grouping related content** — a heading, some text, an action — into one
  visually contained surface.
- **Laying out a row or column of content** with consistent spacing and
  padding, driven by design tokens instead of ad hoc CSS.

## When not to use

- **Expecting a `clicked` event from the card itself.** The card despatches
  nothing — put a real `<kb-button>` or `<a>` in the slot and listen to that
  instead.
- **Expecting the card to be focusable or announced by a screen reader.** The
  card adds no role, no tabindex, and no accessible name — it's transparent to
  the accessibility tree. Only the slotted content is reachable by keyboard or
  assistive technology.

## Composition

- **Can contain**: anything — the shadow root is a single `<slot>`, and the
  card's flex container lays it out. Nothing is intercepted: an interactive
  child keeps its own click, focus, and keyboard behavior untouched.
- **Can be a child of**: anything. Commonly inside a `<kb-render>` list or a
  layout region.

```html preview
<kb-card direction="row">
  <kb-cover src="https://picsum.photos/id/237/120/120" landscape></kb-cover>
  <kb-stack direction="column" spacing="quarck">
    <kb-text size="xxs" weight="bold">Labrador</kb-text>
    <kb-text size="xxxs" color="master">Kind, outgoing, agile</kb-text>
  </kb-stack>
</kb-card>
```

## Direction

`direction` controls how slotted content is stacked, not how it looks.

| Direction | Arrangement | Use for |
|---|---|---|
| `column` (default) | Vertical stack | The common case — heading over body over actions. |
| `row` | Horizontal row | Content meant to sit side by side, like a thumbnail next to a label. |

An unrecognized value is ignored — the property keeps the last valid
`direction` it had (or the default, if none was ever set).

## Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `direction` | `row` \| `column` | `column` | Flex direction of the slotted content. An unrecognized value is ignored — the property keeps the last valid direction it had. |
| `width` | `auto` \| `fill` \| `hug` \| length | `auto` | How the card fills its container. |
| `height` | `auto` \| `fill` \| `hug` \| length | `auto` | Card height. |
| `hidden` | `boolean` | `false` | Removes the card from layout and the accessibility tree. |
| `on` | arc string | — | Echo wiring, `source/event:type/sink`. |

## Events

None. The card despatches nothing of its own — only the slotted content does.

## Styling

Every visual decision is a `--card-*` custom property defaulting to a global
token. They inherit through the shadow boundary — set them on the element or
any ancestor, never reach into the shadow DOM.

| Custom property | Default | Controls |
|---|---|---|
| `--card-color-background` | `var(--color-master-lighter)` | Background of the card. |
| `--card-border-radius` | `var(--border-radius-md)` | Corner radius. |
| `--card-space-gap` | `var(--spacing_inset-xs)` | Gap between slotted children. |
| `--card-space-inset` | `var(--spacing_inset-xs)` | Inner padding. |

```html preview
<div style="--card-border-radius: 8px; --card-space-inset: 8px;">
  <kb-card>
    <kb-text size="xxs">Flatter and tighter, scoped to one area</kb-text>
  </kb-card>
</div>
```

## States and accessibility

- `hidden` removes the card from layout and interaction. Prefer it over not
  rendering the element when the presence or absence should stay findable.
- The card adds no `role`, no `tabindex`, and no accessible name — it never
  receives focus, and a screen reader sees exactly the slotted content, as if
  the card weren't there.

## Do's and don'ts

| Do | Don't |
|---|---|
| Nest a real `<kb-button>` or `<a>` for anything actionable | Expect the card to emit `clicked` or otherwise act on its own |
| Rely on the slotted control's own focus and keyboard behavior | Add `tabindex` or a role to the card to make it "feel" interactive |
| Override `--card-*` tokens to re-skin | Reach into the shadow DOM to change background or padding |
