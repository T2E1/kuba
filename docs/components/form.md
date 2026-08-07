# Form

A form wraps a native `<form>` and turns its two moments into custom events:
`submitted`, carrying the parsed data as a plain object, and `resetted`. Its
content comes from a `<template>` child, optionally interpolated with data — so
the same markup renders empty for a create flow and filled for an edit one.

```html preview
<kb-form autorender>
  <template>
    <kb-input name="email" type="email" required>
      <kb-label>Email</kb-label>
      <kb-validity state="valueMissing">Email is required.</kb-validity>
      <kb-validity state="typeMismatch">That's not an email address.</kb-validity>
    </kb-input>
    <kb-button type="submit">Send</kb-button>
  </template>
</kb-form>
```

## Usage

```html
<kb-form autorender>
  <template>
    <kb-input name="email" required></kb-input>
    <kb-button type="submit">Send</kb-button>
  </template>
</kb-form>
```

```js
document.querySelector('kb-form').addEventListener('submitted', (event) => {
  save(event.detail) // { email: '…' }
})
```

## When to use

- **Collecting a set of fields and acting on the result in JS** — `submitted`
  hands you parsed data, with no `FormData` walk of your own.
- **Editing an existing record** — `render(data)` fills the template's
  `{placeholders}` with current values before the user sees the form.
- **Wiring a form to other elements declaratively** — `submitted` is an Echo
  event, so a `<kb-fetch>` can post it without a listener.

## When not to use

- **A classic server-side post.** The inner `<form>` has no `action` or `method`
  and its native submit is prevented; a page that should navigate on submit
  wants a plain `<form>`.
- **A single field with a button** — a `<kb-input>` and a `<kb-button>` in a
  `<kb-stack>` is less machinery when there's nothing to parse.
- **Layout only.** The element exists for the submit/reset lifecycle; to arrange
  fields without it, use `<kb-stack>`.

## Composition

- **Can contain**: exactly one `<template>` child, holding the fields and the
  submit control. Its markup is what gets rendered into the shadow `<form>`.
  **Light-DOM children outside the template are not projected** — there is no
  `<slot>`.
- **Can be a child of**: anything. The host is full-width and lays its fields
  out as a column.

Inside the template, use the library's form controls — `<kb-input>`,
`<kb-textarea>`, `<kb-fileupload>` — plus a `<kb-button type="submit">`. Being
form-associated, they register with the inner `<form>` and appear in the
submitted data by their `name`.

## Rendering the template

Content is not rendered until `render()` runs. There are two ways to trigger it,
and choosing between them is the main decision this element asks of you.

**`autorender`** renders once on connect, with no data. Right for a blank form:
fields appear as authored and `{placeholders}` resolve to nothing.

**`render(data)`** you call when the data arrives. Every `{path}` in the template
is replaced by the matching value — `{}` is the whole object, `{user.email}` a
nested lookup — which is how an edit form gets pre-filled:

```js
document.querySelector('kb-form').render({ email: 'ada@example.com' })
```

Each call re-renders the shadow DOM, replacing the current fields **and any
values the user has typed**. Render on data arrival, not on every keystroke.

!> The template is read at render time. Markup added to the `<template>`
afterwards — by a framework that fills its children asynchronously — is not
picked up unless `render()` runs again.

## Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `autorender` | `boolean` | `false` | Render the template on connect, without waiting for `render()`. |
| `template` | `string` | — | Id of a `<template>` elsewhere in the document, used instead of a child one. |
| `hidden` | `boolean` | `false` | Removes the form from layout and the accessibility tree. |
| `on` | arc string | — | Echo wiring, `source/event:type/sink`. |

## Methods

| Method | Returns | Description |
|---|---|---|
| `render(data?)` | `this` | Renders the template, interpolating `{path}` placeholders from `data`. |
| `submit()` | `this` | Submits the inner form, triggering validation and then `submitted`. |
| `reset()` | `this` | Resets the inner form, triggering `resetted`. |

## Events

| Event | Fires when | `detail` |
|---|---|---|
| `submitted` | the inner form is submitted, natively or via `submit()` | the form's data as a plain object |
| `resetted` | the inner form is reset, natively or via `reset()` | `{}` |

Both are re-dispatched from the host after the native event is stopped, so the
page never navigates. `submit()` and `reset()` go through the same path, which
means every field's validation runs first.

```html
<kb-form name="signup" autorender>…</kb-form>
<kb-fetch url="/api/signup" method="post">
  <kb-on value="signup/submitted:method/post"></kb-on>
</kb-fetch>
```

## Styling

| Custom property | Default | Controls |
|---|---|---|
| `--form-direction` | `column` | `flex-direction` of the field list; `row` for a compact inline form. |
| `--form-align` | `start` | `align-items` of the fields; `stretch` makes them fill the width. |
| `--form-space-gap` | `var(--spacing_inset-xs)` | Gap between fields. |

Fields sit at their natural width by default, since `align-items` is `start`. A
form whose inputs should span the full width sets the alignment:

```html preview
<div style="--form-align: stretch;">
  <kb-form autorender>
    <template>
      <kb-input name="city"><kb-label>City</kb-label></kb-input>
      <kb-button type="submit" width="fill">Save</kb-button>
    </template>
  </kb-form>
</div>
```

## States and accessibility

- `hidden` removes the form from layout and from the accessibility tree.
- The inner `<form>` is a real form element, so native validation runs on
  submit: an invalid field blocks `submitted` and reports itself. You don't need
  to check validity before dispatching.
- **Fields live in the host's shadow DOM**, not in the page's light DOM. An
  external `<label for>` can't reach them — label each field with its own
  `<kb-label>`.
- Give the form an accessible name when a page holds more than one:
  `<kb-form aria-label="Sign up">`. There is no `name`-derived labelling.
- Keep the submit control inside the template. A button outside the element
  belongs to a different form, or none, and won't submit this one.

## Do's and don'ts

| Do | Don't |
|---|---|
| Put every field and the submit button inside the `<template>` | Place fields as light-DOM children — they are never projected |
| Use `autorender` for a blank form, `render(data)` for a filled one | Call `render()` on each change and wipe what the user typed |
| Read submitted values from `event.detail` | Query the shadow DOM for the fields to collect values |
| Let native validation gate the submit | Re-check the fields in script before calling `submit()` |
