# Textarea

A multi-line text field that grows with what's typed into it. It wraps a real
`<textarea>` and reports value and validity to the owning `<form>` through
`ElementInternals`, so it submits like a native control — with the manual resize
handle removed, since the height is managed for you.

```html preview
<kb-textarea name="bio" placeholder="Tell us about yourself" required>
  <kb-label>Bio</kb-label>
  <kb-helper>A sentence or two.</kb-helper>
</kb-textarea>
```

## Usage

```html
<kb-textarea name="bio" required>
  <kb-label>Bio</kb-label>
</kb-textarea>
```

```js
document.querySelector('kb-textarea').addEventListener('changed', (event) => {
  console.log(event.detail) // the current value
})
```

## When to use

- **Free-form text longer than a line** — a bio, a note, a message, a
  description.
- **Content whose length varies a lot between users** — the field grows instead
  of forcing a scroll inside a fixed box.

## When not to use

- **A single-line value** — use `<kb-input>`, which carries the full set of
  constraint attributes (`type`, `pattern`, `min`/`max`) this element doesn't.
- **Rich text** — this is plain text: no formatting, no preview, no toolbar.
- **Very long documents** — a field that grows without bound pushes the submit
  action off screen. Past a few paragraphs, an editor view serves better.

## Composition

- **Can contain**: content for its three named slots — `label`, `helper` and
  `validity`. Anything unslotted is dropped. `<kb-label>`, `<kb-helper>` and
  `<kb-validity>` all assign themselves to the matching slot on connect, so
  nesting them is the whole setup.
- **Can be a child of**: a `<form>`, a `<kb-form>`'s template, or nothing — it
  works standalone, it just has no form to submit to.

```html preview
<kb-textarea name="note" required>
  <kb-label>Note</kb-label>
  <kb-validity state="valueMissing">Write something first.</kb-validity>
</kb-textarea>
```

## Height and growth

The field starts at `--textarea-size-min-height` (128px, roughly four lines) and
grows on every input: the handler resets the height and re-applies
`scrollHeight`, so the box always fits its content exactly.

Two consequences:

- **It never shrinks below the minimum, and it never scrolls.** `overflow:
  hidden` with `resize: none` means the content is always fully visible. A long
  answer makes a long field.
- **The growth is inline style on the inner element**, applied per input event.
  Setting a `height` from outside is overwritten as soon as the user types — use
  `--textarea-size-min-height` to change the starting size.

Pick the minimum height to signal the expected answer length: a two-line box
invites a sentence, an eight-line box invites a paragraph.

```html preview
<div style="--textarea-size-min-height: 72px;">
  <kb-textarea name="brief" placeholder="One sentence is enough">
    <kb-label>Summary</kb-label>
  </kb-textarea>
</div>
```

## Validation

Constraints are declared as attributes and evaluated by the browser; the outcome
is mirrored onto the host as an `invalid` custom state.

- `required` is the constraint that applies here — the length and format
  constraints of `<kb-input>` are not forwarded by this element.
- Read the result through `checkValidity()`, `reportValidity()`, `validity` and
  `validationMessage`.
- While the host is `invalid`, the `helper` slot is hidden, so the error message
  replaces the hint rather than stacking under it.

`reset()` clears the value and the invalid state and dispatches `reset`, which is
how `<kb-form>`'s reset reaches the field.

## Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | `''` | Field name in the owning form's `FormData`. |
| `value` | `string` | — | Current value. Setting it re-runs validation and dispatches `changed`. |
| `placeholder` | `string` | — | Placeholder, forwarded to the inner `<textarea>`. |
| `required` | `boolean` | `false` | Whether a value is required for validity. |
| `disabled` | `boolean` | `false` | Disables the field and excludes it from submission. |
| `readonly` | `boolean` | `false` | Blocks editing but keeps the value in `FormData`. |
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

The same event name `<kb-input>` and `<kb-fileupload>` publish, so one arc works
for any of the three fields.

## Styling

| Custom property | Default | Controls |
|---|---|---|
| `--textarea-color-background` | `var(--color-master-lightest)` | Field background. |
| `--textarea-color-background_disabled` | `var(--color-master-lighter)` | Background when disabled or read-only. |
| `--textarea-color-border` | `var(--color-master-light)` | Border at rest. |
| `--textarea-color-focus` | `var(--color-primary)` | Border on focus. |
| `--textarea-color-invalid` | `var(--color-danger)` | Border while `invalid`. |
| `--textarea-color-text` | `var(--color-master-darkest)` | Typed text. |
| `--textarea-color-text_disabled` | `var(--color-master)` | Text when disabled or read-only. |
| `--textarea-color-placeholder` | `var(--color-master)` | Placeholder text. |
| `--textarea-font-family` | `var(--font-family-base)` | Type family. |
| `--textarea-font-size` | `var(--font-size-xxs)` | Type size. |
| `--textarea-line-height` | `var(--line-height-lg)` | Line height — the main lever on how many lines fit the starting height. |
| `--textarea-size-min-height` | `128px` | Starting height, before the field grows. |
| `--textarea-space-inset` | `var(--spacing_inset-nano) var(--spacing_inset-xs)` | Padding; accepts the full shorthand. |
| `--textarea-border-radius` | `var(--border-radius-sm)` | Corner rounding. |
| `--textarea-space-gap` | `var(--spacing-nano)` | Gap between label, field and helper. |

Width is an attribute, not a custom property — set `width` rather than a CSS
rule.

## States and accessibility

- `hidden` removes the field from layout and from the accessibility tree.
- `invalid` is a custom state derived from the Constraint Validation API, not an
  attribute you set.
- The inner `<label for>` targets the inner textarea via `id`, falling back to
  `name` — a field with neither has an unlabelled control.
- Growing the field moves everything below it down. Keep the submit action in a
  position that survives that, so it doesn't jump away while the user types.
- `disabled` removes the field from submission; `readonly` keeps its value in
  the `FormData`.

## Do's and don'ts

| Do | Don't |
|---|---|
| Size `--textarea-size-min-height` to the expected answer | Ship the default 128px for a field that always holds one line |
| Set `name` (or `id`) so the label associates and the value submits | Rely on a visible `<kb-label>` alone to name the field |
| Use `<kb-input>` when the answer is a single line | Reach for a textarea because it "looks roomier" |
| Throttle before driving a request from `changed` | Fire a request per keystroke straight from the event |
