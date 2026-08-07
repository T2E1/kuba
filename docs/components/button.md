# Button

A button triggers a synchronous action owned by the page it's on — form
submission, form reset, or a `clicked` event other elements subscribe to. It
never changes the URL. If the outcome is a new location, wire `<kb-redirect>` to
the button's `clicked` event instead of putting that logic in the button.

```html preview
<kb-button>Save</kb-button>
<kb-button variant="naked">Cancel</kb-button>
<kb-button variant="link">Learn more</kb-button>
<kb-button color="danger">Delete</kb-button>
```

## Usage

```html
<kb-button type="submit" color="primary">Save</kb-button>
```

```js
document.querySelector('kb-button').addEventListener('clicked', (event) => {
  console.log(event.detail) // the button's `value`
})
```

## When to use

- Submitting or resetting a `<form>` (`type="submit"` / `type="reset"`).
- Triggering an action local to the page — opening a dialog, adding a row,
  deleting a record — where the response is a `clicked` event, not a URL change.

## When not to use

- **Navigating to another route or URL.** Use a plain `<a>` for external or
  full-page navigation, or `<kb-redirect>` wired to a button's `clicked` event
  for in-app navigation. `kb-button` has no concept of a destination.

## Variants

`variant` expresses emphasis, not decoration — pick by how important the action
is relative to its siblings, not by taste.

```html preview
<kb-button variant="solid">Solid</kb-button>
<kb-button variant="naked">Naked</kb-button>
<kb-button variant="ghost">Ghost</kb-button>
<kb-button variant="link">Link</kb-button>
<kb-button variant="icon"><kb-icon use="home"></kb-icon></kb-button>
```

| Variant | Emphasis | Use for |
|---|---|---|
| `solid` (default) | Highest | The one primary action in an area. More than one per area and neither reads as primary. |
| `naked` | Medium | A secondary action next to a `solid` one — "Cancel" beside "Save". |
| `ghost` | Medium-low | An action inside a filled surface, where a bordered button would compete with it. |
| `link` | Lowest | An action that reads like a text link — inline in prose or a table cell. |
| `icon` | Compact | Icon-only, where space is constrained. Always give it an accessible name. |

## Color

`color` carries meaning; it isn't a styling knob.

```html preview
<kb-button color="primary">Primary</kb-button>
<kb-button color="danger">Delete</kb-button>
<kb-button color="success">Confirm</kb-button>
<kb-button color="warning">Review</kb-button>
```

- `primary` — the default, for ordinary actions.
- `danger` — reserved for destructive or hard-to-undo actions. Not for emphasis.
- `master`, `complete`, `success`, `warning`, `info`, `menu` — only when the
  outcome genuinely matches that semantic.

## Width

`width` controls how the button fills its container, not its visual weight.

```html preview
<div style="width: 100%">
  <kb-button width="fill">Continue</kb-button>
</div>
```

- `auto` (default) — hugs the label; use inline, next to other content.
- `fill` — spans the container; for a single full-width action.
- `hug` — explicit synonym for `auto`.
- A `px`/`%` value — only when a spec demands it. A fixed width doesn't adapt to
  a translated label.

## Composition

- **Can contain**: plain text (the label), `<kb-icon>` for icon-only or
  icon+label buttons, and one or more `<kb-on>` for extra arcs beyond the single
  `on` attribute. Anything else still renders, but slotted content gets
  `pointer-events: none`, so it can't intercept the click meant for the button.
- **Can be a child of**: anything. Commonly inside `<kb-form>` as the submit
  control, inside `<kb-card>`, or standalone.

```html preview
<kb-button>
  <kb-icon use="download"></kb-icon>
  Download
</kb-button>
```

## Content

The label should be a short, specific verb phrase — "Save", "Delete file", "Add
row" — not a vague "OK" or "Submit". Long labels wrap rather than truncate; the
button doesn't clip text.

## Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `color` | `string` | `primary` | Semantic color, resolved against `--color-{value}`. |
| `variant` | `solid` \| `naked` \| `ghost` \| `link` \| `icon` | `solid` | Emphasis level. |
| `width` | `auto` \| `fill` \| `hug` \| length | `auto` | How the button fills its container. |
| `type` | `submit` \| `reset` | `submit` | Behavior inside an owning `<form>`. |
| `value` | `string` | — | Payload sent as the `clicked` event's `detail`. |
| `hidden` | `boolean` | `false` | Removes the button from layout and the accessibility tree. |
| `on` | arc string | — | Echo wiring, `source/event:type/sink`. |

## Events

| Event | Fires when | `detail` |
|---|---|---|
| `clicked` | the button is activated | the `value` attribute |

## Styling

Every visual decision is a `--button-*` custom property defaulting to a global
token. Custom properties inherit through the shadow boundary, so set them on the
element or any ancestor — never reach into the shadow DOM.

| Custom property | Default | Controls |
|---|---|---|
| `--button-color-accent` | `var(--color-{color})` | Accent filling `solid` and coloring text/border of the rest. |
| `--button-color-text` | `var(--color-pure-white)` | Label color on `solid`. |
| `--button-color-background-ghost` | `var(--color-master-lighter)` | Background of `ghost`. |
| `--button-font-family` | `var(--font-family-base)` | Label typeface. |
| `--button-font-size` | `var(--font-size-xxs)` | Label size. |
| `--button-font-weight` | `var(--font-weight-medium)` | Label weight. |
| `--button-line-height` | `var(--line-height-default)` | Label line height. |
| `--button-letter-spacing` | `0.38px` | Label tracking. |
| `--button-size-height` | `40px` | Height, and the square side of `icon`. |
| `--button-size-min-width` | `40px` | Minimum width, so short labels stay tappable. |
| `--button-space-inline` | `var(--spacing_inset-xs)` | Horizontal padding. |
| `--button-space-gap` | `var(--spacing_inset-nano)` | Gap between label and slotted icon. |
| `--button-border-width` | `var(--border-width-thin)` | Border thickness. |
| `--button-border-radius` | `var(--border-radius-sm)` | Corner radius. |
| `--button-transition` | `all 0.2s ease-out` | Transition on interaction. |

```html preview
<div class="checkout" style="--button-size-height: 56px; --button-border-radius: 500px; --button-font-size: 16px;">
  <kb-button>Checkout</kb-button>
</div>
```

## States and accessibility

- `hidden` removes the button from layout and interaction. Prefer it over not
  rendering the element when the presence or absence should stay findable in the
  DOM.
- An `icon` button with no text needs an accessible name from context — put
  `aria-label` on the `kb-button` itself. The glyph conveys nothing to assistive
  technology.
- `type="submit"` only does something inside a `<form>`. Standalone, it's a
  silent no-op on click.

## Do's and don'ts

| Do | Don't |
|---|---|
| Use exactly one `solid` button per area for the primary action | Put two `solid` buttons side by side — neither reads as primary |
| Reserve `color="danger"` for destructive actions | Use `danger` just to make a button stand out |
| Give an icon-only button an accessible name | Ship an icon-only button with no label for assistive tech |
| Use `width="fill"` for the single action in a narrow form | Fix `width` in px for a label that can grow when translated |
