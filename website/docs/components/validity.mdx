# Validity

One error message bound to one failure. It watches a single `ValidityState` key
on its parent field — `valueMissing`, `typeMismatch`, `tooShort` — and shows
itself only while that specific flag is true, so the user reads the reason
rather than "invalid".

```html preview
<kb-input name="email" type="email" required minlength="6">
  <kb-label>Email</kb-label>
  <kb-validity state="valueMissing">This field is required.</kb-validity>
  <kb-validity state="typeMismatch">Enter a valid email address.</kb-validity>
  <kb-validity state="tooShort">At least 6 characters.</kb-validity>
</kb-input>
```

Type a single letter, then clear the field, to see the three messages swap.

## Usage

```html
<kb-input name="email" type="email" required>
  <kb-validity state="typeMismatch">Enter a valid email address.</kb-validity>
</kb-input>
```

## When to use

- **Explaining a specific constraint failure** — one element per rule the field
  can break, each with its own wording.
- **Replacing the browser's native bubble** with a message that lives in the
  layout, matches the design, and stays visible while the user fixes the field.

## When not to use

- **A hint that's always relevant** — that's `<kb-helper>`, visible from the
  start. This element is invisible until its rule fails.
- **A form-level error** ("Could not save, try again") — that isn't a
  `ValidityState` on a field. Render it near the submit action.
- **Outside a form-associated element.** The element reads
  `parentElement.validity` directly; with no such parent it never becomes
  visible and quietly does nothing.

## Composition

- **Can contain**: the message text and inline markup. The host is `inline` when
  shown, so keep it to a phrase.
- **Can be a child of**: `<kb-input>`, `<kb-textarea>` or `<kb-fileupload>` —
  and only as a **direct** child, since the parent is where `validity` is read
  from. It assigns itself `slot="validity"` on connect, so nesting is the whole
  setup.

Use as many as the field has failure modes; they're mutually exclusive by
construction, since the browser reports one failure at a time.

## Which state

`state` names a property of the native
[`ValidityState`](https://developer.mozilla.org/docs/Web/API/ValidityState) of
the parent. It's used as a key lookup, so it must match the DOM property exactly
— camelCase, not the attribute name that causes it.

| `state` | Fires when | Caused by |
|---|---|---|
| `valueMissing` | the field is empty | `required` |
| `typeMismatch` | the value isn't the right kind | `type="email"`, `type="url"` |
| `patternMismatch` | the value doesn't match the regex | `pattern` |
| `tooShort` / `tooLong` | length is out of range | `minlength` / `maxlength` |
| `rangeUnderflow` / `rangeOverflow` | a number or date is out of range | `min` / `max` |
| `stepMismatch` | the value isn't on the step grid | `step` |
| `badInput` | the browser can't parse what was typed | letters in `type="number"` |

!> A misspelled key — `valuemissing`, or the attribute name `required` — reads
as `undefined` and the message simply never appears. There is no warning. Check
the spelling first when a message doesn't show.

The element re-evaluates on `changed`, `invalid` and `reset` from its parent, so
it updates as the user types and clears when the field is reset.

## Content

Say what to do, not that something is wrong: "Enter a valid email address" beats
"Invalid email". Keep each message to one line — the element uses the smallest
step of the type scale.

## Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `state` | `ValidityState` key | — | Which validity flag to watch on the parent. |
| `on` | arc string | — | Echo wiring, `source/event:type/sink`. |

This element dispatches no events. It has no `hidden` attribute — visibility is
driven entirely by the `invalid` custom state it sets on itself.

## Styling

| Custom property | Default | Controls |
|---|---|---|
| `--validity-color` | `var(--color-danger)` | Message color. |
| `--validity-font-family` | `var(--font-family-base)` | Type family. |
| `--validity-font-size` | `var(--font-size-xxxs)` | Type size. |
| `--validity-font-weight` | `var(--font-weight-regular)` | Type weight. |
| `--validity-line-height` | `var(--line-height-lg)` | Line height. |

The defaults match `<kb-helper>` except for the color — deliberate, since the
error takes the helper's place in `<kb-input>` and `<kb-textarea>` while the
field is invalid.

```html preview
<div style="--validity-color: var(--color-warning);">
  <kb-input name="nickname" minlength="3">
    <kb-label>Nickname</kb-label>
    <kb-validity state="tooShort">Short names are hard to find.</kb-validity>
  </kb-input>
</div>
```

## States and accessibility

- Visibility is driven by the `invalid` custom state on **this** element, which
  mirrors the one `ValidityState` key it watches — not the parent's overall
  validity. Style it with `:state(invalid)`; don't set it.
- `display: none` until the rule fails means assistive technology sees nothing at
  first, and the message appears mid-interaction without being announced. Add
  `aria-live="polite"` on the element when the error must be heard as it
  appears.
- The message isn't linked to the field by `aria-describedby` — the association
  is structural, not programmatic. Add the attribute on the control when a
  screen reader must tie them together.
- Color alone doesn't carry the error; the wording does. That's why each message
  states its own rule.

## Do's and don'ts

| Do | Don't |
|---|---|
| Nest one element per failure mode | Write one generic message for every rule |
| Match `state` to the `ValidityState` key, camelCase | Use the attribute name (`required`) as the state |
| Keep it a direct child of the field | Wrap it in a `<div>` — the parent is where validity is read |
| Tell the user how to fix it | State only that the value is invalid |
