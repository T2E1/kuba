# Input

A single-line text field that behaves like a native one from the form's point of
view: it wraps a real `<input>` in its shadow DOM and reports value and validity
to the owning `<form>` through `ElementInternals`. Form-associated, so it submits
without a hidden field or a manual `FormData` step.

```html preview
<kb-input name="email" type="email" placeholder="you@example.com" required>
  <kb-label>Email</kb-label>
  <kb-helper>We'll never share it.</kb-helper>
</kb-input>
```

## Usage

```html
<kb-input name="email" type="email" required>
  <kb-label>Email</kb-label>
</kb-input>
```

```js
document.querySelector('kb-input').addEventListener('changed', (event) => {
  console.log(event.detail) // the current value
})
```

## When to use

- **Any single-line value** — email, name, quantity, date — inside a `<form>` or
  a `<kb-form>`.
- **Fields that must validate natively** — `required`, `pattern`, `min`, `max`,
  `minlength`, `maxlength` and `type` are forwarded to the inner input, so the
  browser does the checking.
- **Fields that publish changes**, which Echo can wire to another element
  without a listener.

## When not to use

- **Multi-line text** — use `<kb-textarea>`, which grows with its content.
- **A file** — use `<kb-fileupload>`, which previews the selection and encodes
  it for submission.
- **Choosing among known options** — a field that expects one of five values
  should be a select or a radio group. `pattern` is not a substitute for a
  constrained control.

## Composition

- **Can contain**: content for its three named slots — `label`, `helper` and
  `validity`. Anything unslotted is dropped. `<kb-label>`, `<kb-helper>` and
  `<kb-validity>` all assign themselves to the matching slot on connect, so
  nesting them is the whole setup; more than one `<kb-validity>` can share the
  slot.
- **Can be a child of**: a `<form>`, a `<kb-form>`'s template, or nothing at all
  — it works standalone, it just has no form to submit to.

```html preview
<kb-input name="password" type="password" required minlength="8">
  <kb-label>Password</kb-label>
  <kb-helper>At least 8 characters.</kb-helper>
  <kb-validity state="valueMissing">Choose a password.</kb-validity>
  <kb-validity state="tooShort">At least 8 characters.</kb-validity>
</kb-input>
```

## Validation

Constraints are declared as attributes and evaluated by the browser; the result
is mirrored onto the host as an `invalid` custom state, which the styling and
`<kb-validity>` react to.

- Set `required`, `pattern`, `min`/`max`, `minlength`/`maxlength` and `type` on
  the element — they reach the inner input unchanged.
- Read the outcome through `checkValidity()`, `reportValidity()`, `validity` and
  `validationMessage`, the same API a native input exposes.
- While the host is `invalid`, the `helper` slot is hidden, so the error message
  replaces the hint instead of stacking under it. A hint and its error shouldn't
  repeat each other.
- Give each failure its own `<kb-validity state="…">`. One generic message
  forces the user to guess which rule they broke.

`reset()` clears the value and the invalid state and dispatches `reset` — this is
how `<kb-form>`'s reset flows through to every field.

## Events

`changed` fires on every value change, carrying the new value:

```html preview
<kb-input name="query" placeholder="Type here">
  <kb-label>Live echo</kb-label>
</kb-input>
<kb-render>
  <kb-on value="query/changed:method/render"></kb-on>
  <template>You typed: {}</template>
</kb-render>
```

It fires **per keystroke**, not on blur, and it's named `changed`, not the native
`change`. Arc filters can't debounce it — they're synchronous payload transforms
and can't defer the sink — so throttle inside the sink method, or use a plain
listener, before driving a request.

## Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | `''` | Field name in the owning form's `FormData`. |
| `type` | `string` | — | Input type, forwarded to the inner `<input>`. |
| `value` | `string` | — | Current value. Setting it re-runs validation and dispatches `changed`. |
| `placeholder` | `string` | — | Placeholder, forwarded. |
| `required` | `boolean` | `false` | Whether a value is required for validity. |
| `disabled` | `boolean` | `false` | Disables the field and excludes it from submission. |
| `readonly` | `boolean` | `false` | Blocks editing but keeps the value in `FormData`. |
| `pattern` | `string` | — | Regular expression the value must match. |
| `min` / `max` | `string` | — | Value bounds, forwarded. |
| `minlength` / `maxlength` | `string` | — | Length bounds, forwarded. |
| `step` | `string` | — | Stepping interval for numeric and date types. |
| `inputmode` | `string` | — | Virtual keyboard hint, forwarded. |
| `id` | `string` | falls back to `name` | Used by the inner `<label for>`. |
| `width` | `auto` \| `fill` \| length | `auto` | How the field fills its container. |
| `hidden` | `boolean` | `false` | Removes the field from layout and the accessibility tree. |

## Methods

| Method | Returns | Description |
|---|---|---|
| `checkValidity()` | `boolean` | Validates and fires `invalid` if it fails. |
| `reportValidity()` | `boolean` | Validates and reports the problem to the user. |
| `reset()` | `this` | Clears the value and the invalid state, dispatches `reset`. |

## Events

| Event | Fires when | `detail` |
|---|---|---|
| `changed` | the value changes, per keystroke | the new value |

## Styling

| Custom property | Default | Controls |
|---|---|---|
| `--input-color-background` | `var(--color-master-lightest)` | Field background. |
| `--input-color-background_disabled` | `var(--color-master-lighter)` | Background when disabled or read-only. |
| `--input-color-border` | `var(--color-master-light)` | Border at rest. |
| `--input-color-focus` | `var(--color-primary)` | Border on focus. |
| `--input-color-invalid` | `var(--color-danger)` | Border while `invalid`. |
| `--input-color-text` | `var(--color-master-dark)` | Typed text. |
| `--input-color-text_disabled` | `var(--color-master)` | Text when disabled or read-only. |
| `--input-color-placeholder` | `var(--color-master)` | Placeholder text. |
| `--input-font-family` | `var(--font-family-base)` | Type family. |
| `--input-font-size` | `var(--font-size-xxs)` | Type size. |
| `--input-size-height` | `40px` | Field height. |
| `--input-space-inset` | `var(--spacing_inset-nano) var(--spacing_inset-xs)` | Padding; accepts the full shorthand. |
| `--input-border-radius` | `var(--border-radius-sm)` | Corner rounding. |
| `--input-space-gap` | `var(--spacing-nano)` | Gap between label, field and helper. |

Width is an attribute, not a custom property — set `width` rather than a CSS
rule.

```html preview
<div style="--input-size-height: 56px; --input-font-size: 20px;">
  <kb-input name="hero" placeholder="A larger field">
    <kb-label>One question per step</kb-label>
  </kb-input>
</div>
```

## States and accessibility

- `hidden` removes the field from layout and from the accessibility tree.
- `invalid` is a custom state set from the Constraint Validation API, not an
  attribute you set. Style it with `:state(invalid)`; don't force it.
- The inner `<label for>` points at the inner input using `id`, falling back to
  `name`. **A field with neither has an unlabelled input** — the visible
  `<kb-label>` alone doesn't name it for assistive technology.
- `disabled` removes the field from submission entirely; `readonly` keeps it in
  the `FormData`. Choose by whether the value should still be sent.
- The error message replaces the helper visually. If the hint carries a
  requirement the user still needs while fixing the error, repeat it in the
  `<kb-validity>` message.

## Do's and don'ts

| Do | Don't |
|---|---|
| Set `name` (or `id`) so the label associates and the value submits | Rely on a visible `<kb-label>` alone to name the field |
| Give each constraint its own `<kb-validity state="…">` | Ship one generic "Invalid input" for every failure |
| Throttle before driving a request from `changed` | Fire a request per keystroke straight from the event |
| Use `type` and `pattern` so the browser validates | Re-implement format checking in script and set the state by hand |
