# Helper

The small secondary line under a form field: a hint, a format requirement, a
note. It carries one fixed type style and, on connect, assigns itself
`slot="helper"` — so nesting it inside a field is all the wiring there is.

```html preview
<kb-input name="password" type="password" minlength="8">
  <kb-label>Password</kb-label>
  <kb-helper>Must be at least 8 characters.</kb-helper>
</kb-input>
```

## Usage

```html
<kb-input name="password">
  <kb-helper>Must be at least 8 characters.</kb-helper>
</kb-input>
```

## When to use

- **Stating a constraint before the user hits it** — "Must be at least 8
  characters", "Format: DD/MM/YYYY" — under the field it describes.
- **Showing a note about the field** authored by you, rather than derived from
  the browser's `ValidityState`.
- **Adding context a label shouldn't carry** — a label names the field and stays
  short; the reasoning goes here.

## When not to use

- **A message tied to a `ValidityState` key** — use `<kb-validity state="…">`,
  which listens to the parent field and shows itself only for that failure. This
  element is always visible; it doesn't react to validity.
- **Naming the field** — that's `<kb-label>`, which auto-slots into `label` and
  carries the larger, medium-weight style.
- **Body copy** — `<kb-text>` is the general text element, with the full set of
  size, color and weight attributes. This deliberately has none.

## Composition

- **Can contain**: text and inline markup — the shadow root is a single unnamed
  `<slot>`. A link inside the hint is fine; block-level content isn't, since the
  host is `inline-flex`.
- **Can be a child of**: any component exposing a `helper` slot — `<kb-input>`,
  `<kb-textarea>`, `<kb-fileupload>`. Placed anywhere else it still renders, but
  the `slot="helper"` it sets on itself matches nothing.

!> **In `<kb-input>` and `<kb-textarea>`, the helper is hidden while the field
is invalid** — the `<kb-validity>` message takes its place rather than stacking
under it. If the hint carries a requirement the user still needs while fixing
the error, repeat it in the validity message. `<kb-fileupload>` doesn't do this;
its helper stays visible.

```html preview
<kb-input name="username" required minlength="3">
  <kb-label>Username</kb-label>
  <kb-helper>Letters and numbers only, 3 characters minimum.</kb-helper>
  <kb-validity state="valueMissing">Pick a username — letters and numbers, 3 minimum.</kb-validity>
</kb-input>
```

## Content

Keep it to one line. The type is the smallest step of the scale (12px) at the
loosest line height, which reads well for a single line and poorly for a
paragraph.

Write the requirement, not the failure: "Must be at least 8 characters" tells
the user what to do before *and* after the error, while "Invalid password" only
says something went wrong. Reserve the error phrasing for `<kb-validity>`.

## Attributes

This element has no attributes and dispatches no events. Its type style is fixed
by design so hints look the same everywhere.

## Styling

| Custom property | Default | Controls |
|---|---|---|
| `--helper-color` | `var(--color-master-dark)` | Text color. |
| `--helper-font-family` | `var(--font-family-base)` | Type family. |
| `--helper-font-size` | `var(--font-size-xxxs)` (12px) | Type size. |
| `--helper-font-weight` | `var(--font-weight-regular)` | Type weight. |
| `--helper-line-height` | `var(--line-height-lg)` | Line height. |

Color is the one worth reaching for — use a semantic token so the meaning
carries, rather than picking a shade:

```html preview
<div style="--helper-color: var(--color-info);">
  <kb-input name="invite">
    <kb-label>Invite code</kb-label>
    <kb-helper>Optional — leave blank to join the public workspace.</kb-helper>
  </kb-input>
</div>
```

## States and accessibility

- `kb-helper` has no `hidden` attribute and no custom states — remove the
  element when the hint no longer applies.
- **The element carries no ARIA relationship to the field.** A screen reader
  reads it only if it lands next to the input in the reading order. To
  guarantee it, give the helper an `id` and set `aria-describedby` on the
  control.
- `--color-master-dark` on a white surface is intentionally lower contrast than
  body text. Keep it above 4.5:1 against the surface; if a hint must be noticed,
  promote it to `<kb-validity>` or a colored `<kb-text>` rather than dimming it
  further.
- Don't rely on color alone for a warning hint — the wording has to say it.

## Do's and don'ts

| Do | Don't |
|---|---|
| Nest it inside the field and let it slot itself | Set `slot="helper"` by hand — the element already does |
| Keep it to a single short line | Write a paragraph at 12px |
| Use `<kb-validity>` for messages tied to a validity state | Toggle a `kb-helper` from script to fake validation |
| Link it with `aria-describedby` from the control | Assume proximity alone associates it for screen readers |
