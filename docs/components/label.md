# Label

The name of a form field: one fixed type style, slightly heavier than body text,
that assigns itself `slot="label"` on connect. It's the visible name — it is
**not** a native `<label>`, so clicking it doesn't focus the field.

```html preview
<kb-input name="fullname">
  <kb-label>Full name</kb-label>
</kb-input>
```

## Usage

```html
<kb-input name="email">
  <kb-label>Email</kb-label>
</kb-input>
```

## When to use

- **Naming a field** — inside `<kb-input>`, `<kb-textarea>` or
  `<kb-fileupload>`, which all expose a `label` slot.
- **Naming a group of controls**, where a heading would be too loud and body
  text too quiet.

## When not to use

- **Explaining or constraining the input** — that's `<kb-helper>`, the smaller
  line beneath the field. A label stays a name.
- **A message tied to validation** — use `<kb-validity>`, which appears only for
  the `ValidityState` key it watches.
- **Any other text** — `<kb-text>` is the general-purpose element, with
  attributes for size, color and weight. This has none, on purpose: every field
  label in the product looks the same.
- **A section heading** — use `<kb-text size="lg" weight="bold">`, or a real
  heading element for the document outline. A label carries no heading
  semantics.

## Composition

- **Can contain**: text and inline markup — the shadow root is a single unnamed
  `<slot>`. A required marker or an inline `<kb-icon>` works; block-level
  content doesn't, since the host is `inline-flex`.
- **Can be a child of**: any component exposing a `label` slot. Placed anywhere
  else it still renders, but the `slot="label"` it sets on itself matches
  nothing.

The element sets its own `slot` attribute on connect, so you nest it and write
nothing else:

```html preview
<kb-textarea name="bio">
  <kb-label>Bio</kb-label>
  <kb-helper>A sentence or two about yourself.</kb-helper>
</kb-textarea>
```

## Content

Name the field in as few words as possible, in sentence case: "Full name", not
"Please type your full name here". Anything longer belongs in a `<kb-helper>`.

Keep the label stable — a name that changes as the user types, or that doubles
as a placeholder, leaves them with nothing to refer back to.

## Attributes

This element has no attributes and dispatches no events. Its type style is fixed
by design so field labels are uniform across the product.

## Styling

| Custom property | Default | Controls |
|---|---|---|
| `--label-color` | `var(--color-master-dark)` | Text color. |
| `--label-font-family` | `var(--font-family-base)` | Type family. |
| `--label-font-size` | `var(--font-size-xxs)` (14px) | Type size. |
| `--label-font-weight` | `var(--font-weight-medium)` | Type weight — what separates a label from a helper line. |
| `--label-line-height` | `var(--line-height-default)` | Line height. |

These exist for surface-level shifts — an inverted panel, a denser form — not
one-off adjustments:

```html preview
<div style="--label-color: var(--color-primary); --label-font-size: 16px;">
  <kb-input name="highlighted">
    <kb-label>A label shifted for one surface</kb-label>
  </kb-input>
</div>
```

## States and accessibility

- `kb-label` has no `hidden` attribute and no custom states.
- **It is not a `<label>`.** There's no `for` attribute and no implicit
  association, so clicking it doesn't focus the field, and a screen reader won't
  announce it as the control's name from proximity alone. Give the control its
  own accessible name — `aria-label` on the field, or an `id` here plus
  `aria-labelledby` on the control.
- Marking a field required is visual only here; set `required` on the field
  itself so the state is exposed and validated, and let the marker be the
  visible echo of it.
- A hidden or removed label leaves the field unnamed. Keep it present even when
  the design is compact — a placeholder is not a substitute.

## Do's and don'ts

| Do | Don't |
|---|---|
| Nest it inside the field and let it slot itself | Set `slot="label"` by hand — the element already does |
| Give the control an accessible name of its own | Rely on `kb-label` to name the field for assistive technology |
| Keep it to a short noun phrase in sentence case | Turn it into an instruction — that's `<kb-helper>` |
| Keep the label visible next to the field | Replace it with a placeholder that disappears on focus |
