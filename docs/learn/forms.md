# Forms

kuba's form controls are **form-associated custom elements**: from the owning
`<form>`'s point of view they behave like native inputs. They submit, they
validate, they reset. This page is how the pieces fit together; each element's
page has its full contract.

## The pieces

| Element | Role |
|---|---|
| `<kb-form>` | Renders fields from a `<template>`, publishes `submitted` with parsed data |
| `<kb-input>` | Single-line value |
| `<kb-textarea>` | Multi-line value, grows with content |
| `<kb-fileupload>` | One image, as a base64 data URL |
| `<kb-label>` | The field's visible name |
| `<kb-helper>` | The hint under the field |
| `<kb-validity>` | One error message, bound to one validation rule |

The last three assign themselves to the right slot on connect, so composing a
field is nesting and nothing else:

```html preview
<kb-input name="email" type="email" required>
  <kb-label>Email</kb-label>
  <kb-helper>We'll never share it.</kb-helper>
  <kb-validity state="valueMissing">Email is required.</kb-validity>
  <kb-validity state="typeMismatch">That's not an email address.</kb-validity>
</kb-input>
```

## Validation is the browser's

You don't write validation logic. Declare constraints as attributes, and the
browser evaluates them through the Constraint Validation API:

| Attribute | Fails with |
|---|---|
| `required` | `valueMissing` |
| `type="email"` / `type="url"` | `typeMismatch` |
| `pattern` | `patternMismatch` |
| `minlength` / `maxlength` | `tooShort` / `tooLong` |
| `min` / `max` | `rangeUnderflow` / `rangeOverflow` |
| `step` | `stepMismatch` |

The result is mirrored onto the host as an `invalid` custom state, which drives
both the field's own styling and the visibility of each `<kb-validity>`.

**One message per rule.** A `<kb-validity state="tooShort">` shows only while
that specific flag is true, so the user reads the reason instead of "invalid":

```html preview
<kb-input name="password" type="password" required minlength="8">
  <kb-label>Password</kb-label>
  <kb-helper>At least 8 characters.</kb-helper>
  <kb-validity state="valueMissing">Choose a password.</kb-validity>
  <kb-validity state="tooShort">At least 8 characters.</kb-validity>
</kb-input>
```

?> `<kb-textarea>` and `<kb-fileupload>` only forward `required` — the length,
range and pattern constraints are `<kb-input>` only.

### The helper disappears

While a field is invalid, `<kb-input>` and `<kb-textarea>` hide the `helper`
slot so the error takes its place rather than stacking under it. Two
consequences:

- Don't make the hint and the error say the same thing — the user sees one at a
  time.
- If the hint carries a requirement they still need while fixing the error,
  repeat it in the validity message.

`<kb-fileupload>` doesn't do this; its helper stays visible.

## Reading the values

`<kb-form>` publishes `submitted` with the data already parsed into an object
keyed by each field's `name`:

```html preview
<kb-form autorender id="signup-demo">
  <template>
    <kb-input name="email" type="email" required>
      <kb-label>Email</kb-label>
    </kb-input>
    <kb-input name="company">
      <kb-label>Company</kb-label>
    </kb-input>
    <kb-button type="submit">Create account</kb-button>
  </template>
</kb-form>

<kb-text id="signup-out" size="xxs" color="master">nothing submitted yet</kb-text>

<script type="module">
  document.querySelector('#signup-demo').addEventListener('submitted', (event) => {
    document.querySelector('#signup-out').textContent = JSON.stringify(event.detail)
  })
</script>
```

Native validation runs first, so `submitted` never fires with an invalid field.
There's no "is the form valid" check to write.

You can also skip the form element entirely and read fields directly — every
control exposes `value`, `validity`, `checkValidity()` and `reportValidity()`,
the same API a native input does.

## Fields live in a shadow root

`<kb-form>` renders its `<template>` into its own shadow DOM. That has
consequences worth internalizing:

- **Light-DOM children outside the template are not projected.** Fields must be
  inside the `<template>`.
- **An external `<label for>` can't reach a field.** Label each one with its own
  `<kb-label>`.
- **`document.querySelector('input')` won't find them.** Read values from
  `submitted`, not by querying.
- **The submit control must be inside the template too** — a button outside
  belongs to a different form, or none.

## Pre-filling for an edit flow

`autorender` renders a blank form on connect. For editing, skip it and call
`render(data)` when the record arrives — every `{path}` in the template is
replaced:

```html
<kb-form id="edit-user">
  <template>
    <kb-input name="name" value="{name}"><kb-label>Name</kb-label></kb-input>
    <kb-button type="submit">Save</kb-button>
  </template>
</kb-form>
```

```js
document.querySelector('#edit-user').render({ name: 'Ada Lovelace' })
```

!> Each `render()` call replaces the fields — **and whatever the user has
typed**. Render when the data arrives, never on every change.

## Accessibility

The parts that need your attention, because the elements don't do them for you:

- **Name every field.** The inner `<label for>` targets the inner control via
  `id`, falling back to `name`. A field with neither is unlabelled — the visible
  `<kb-label>` alone doesn't name it for assistive technology.
- **`<kb-validity>` isn't linked to the field.** The association is structural,
  not programmatic. Add `aria-describedby` on the control when a screen reader
  must tie them together, and `aria-live` when the error must be announced as it
  appears.
- **Name the form** when a page holds more than one: `<kb-form aria-label="Sign
  up">`.
- **`disabled` vs `readonly`**: `disabled` removes the field from submission
  entirely; `readonly` keeps its value in the data. Choose by whether the value
  should still be sent.

## Resetting

`reset()` on a field clears its value and its invalid state. `<kb-form>`'s
`reset()` flows through to every field and publishes `resetted`. A
`<kb-button type="reset">` inside the template does the same from markup.

A common pattern is a form that clears itself after a successful add:

```html
<kb-form name="add-item" autorender>
  <template>…</template>
  <kb-on value="add-item/submitted:method/reset"></kb-on>
</kb-form>
```

## Next

- **[Form](/components/form)**, **[Input](/components/input)**,
  **[Validity](/components/validity)** — the full contracts.
- **[Cookbook › User CRUD](/cookbook/user-crud)** — a form wired to a dataset
  and a list, with no listeners at all.
