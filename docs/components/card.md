# Card

A card groups related content into one surface, and can act as a single
clickable unit — a click anywhere inside is absorbed and re-dispatched as one
`clicked` event carrying the card's `value`. It's a grouping primitive, not a
control: on its own it has no focus ring, cursor or role.

```html preview
<kb-card>
  <kb-text size="xs" weight="bold">Akita</kb-text>
  <kb-text size="xxxs" color="master">Docile, courageous, dignified</kb-text>
  <kb-button width="fill">Details</kb-button>
</kb-card>
```

## Usage

```html
<kb-card direction="column" variant="filled" value="42">…</kb-card>
```

```js
document.querySelector('kb-card').addEventListener('clicked', (event) => {
  select(event.detail) // the card's `value`
})
```

## When to use

- **Grouping related content** — a heading, some text, an action — into one
  visually contained surface.
- **Making a whole region emit a single `clicked` event**, like a result tile
  that selects itself, wired to another element with `on` or `<kb-on>`.

## When not to use

- **A single action.** Use `<kb-button>`: a real form-associated control with
  the right affordances and keyboard behavior, not a container that happens to
  be clickable.
- **Navigating to a URL.** Put an `<a>` inside, or a `<kb-button>` wired to
  `<kb-redirect>`. The card has no concept of a destination.

## Composition

- **Can contain**: anything — the shadow root is a single `<slot>`, and the
  card's flex container lays it out. A click on any descendant is absorbed and
  re-emitted as the card's own `clicked`, so an interactive child and the card
  compete for the same gesture. Keep a card either a passive group **or** a
  single clickable unit, never both.
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

## Variants

`variant` is read directly by CSS — there is no `variant` JS property. It
expresses surface treatment, not emphasis.

```html preview
<kb-card variant="filled">
  <kb-text size="xxs">Filled — the default, on a plain page</kb-text>
</kb-card>
<kb-card variant="outlined">
  <kb-text size="xxs">Outlined — for use on a filled surface</kb-text>
</kb-card>
```

| Variant | Surface | Use for |
|---|---|---|
| `filled` (default) | Subtle filled background | The default card on a plain page background. |
| `outlined` | White background with a hairline border | A card sitting **on** a filled surface, where a filled card would blend in. |

## Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `direction` | `row` \| `column` | `column` | Flex direction of the slotted content. |
| `variant` | `filled` \| `outlined` | `filled` | Surface treatment. CSS-only; no JS property. |
| `value` | `string` | `''` | Payload sent as the `clicked` event's `detail`. |
| `width` | `auto` \| `fill` \| length | `auto` | How the card fills its container. |
| `height` | `auto` \| length | `auto` | Card height. |
| `hidden` | `boolean` | `false` | Removes the card from layout and the accessibility tree. |
| `on` | arc string | — | Echo wiring, `source/event:type/sink`. |

## Events

| Event | Fires when | `detail` |
|---|---|---|
| `clicked` | any click inside the card | the `value` attribute |

## Styling

Every visual decision is a `--card-*` custom property defaulting to a global
token. They inherit through the shadow boundary — set them on the element or any
ancestor, never reach into the shadow DOM.

| Custom property | Default | Controls |
|---|---|---|
| `--card-color-background` | `var(--color-master-lighter)` | Background of the `filled` card. |
| `--card-color-background-outlined` | `var(--color-pure-white)` | Background of the `outlined` variant. |
| `--card-color-border` | `var(--color-master-light)` | Border color of `outlined`. |
| `--card-border-width` | `var(--border-width-hairline)` | Border thickness of `outlined`. |
| `--card-border-radius` | `var(--border-radius-md)` | Corner radius, both variants. |
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
- **A clickable card is invisible to assistive technology by default.** The
  element adds no `role`, no `tabindex` and no keyboard handler, so `clicked` is
  mouse-only. If the whole card must be actionable, add `role="button"` and
  `tabindex="0"` and wire keyboard activation — or better, nest a real
  `<kb-button>` and let the card stay a passive group.

## Do's and don'ts

| Do | Don't |
|---|---|
| Keep a card either a passive group or a single clickable unit | Nest an interactive child *and* rely on the card's `clicked` — they fight for the same click |
| Use `outlined` for a card on a filled surface | Use `outlined` on a plain background where `filled` reads fine |
| Nest a real `<kb-button>` or `<a>` for an actionable card | Rely on the card's `clicked` as the only affordance for keyboard users |
| Override `--card-*` tokens to re-skin | Reach into the shadow DOM to change background or padding |
