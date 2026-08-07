# Fileupload

A click target for picking **one image**, which it previews in place and submits
as a base64 data URL. Form-associated, so the encoded image travels in the
form's `FormData` like any other field — no multipart handling on the page.

```html preview
<kb-fileupload name="avatar" required>
  <kb-label>Upload a photo</kb-label>
  <kb-helper>PNG or JPG, up to 5MB</kb-helper>
</kb-fileupload>
```

## Usage

```html
<kb-fileupload name="avatar" required>
  <kb-label>Upload a photo</kb-label>
</kb-fileupload>
```

```js
document.querySelector('kb-fileupload').addEventListener('changed', (event) => {
  console.log(event.detail) // 'data:image/png;base64,…'
})
```

## When to use

- **A single image tied to a record** — an avatar, a cover, a logo — where
  seeing the choice before submitting matters.
- **Forms that post JSON** — the value is already a string, so it fits a JSON
  body without a separate upload endpoint.

## When not to use

- **Multiple files.** The inner input takes one file and the element keeps one
  value; a gallery needs a different control.
- **Non-image files.** The inner input is `accept="image/*"` and the preview is
  an `<img>` — a PDF picker would show a broken preview.
- **Large files.** Base64 inflates the payload by about a third, and the whole
  string is held in memory and posted inline. Past a few megabytes, upload to a
  storage endpoint and submit the resulting URL.

## Composition

- **Can contain**: content for its three named slots — `label`, `helper` and
  `validity`. The first two render inside the drop target itself, centered under
  the icon; `validity` renders below it. All three self-assign on connect.
- **Can be a child of**: a `<form>`, a `<kb-form>`'s template, or nothing.

```html preview
<kb-fileupload name="cover" required>
  <kb-label>Cover image</kb-label>
  <kb-helper>Landscape works best.</kb-helper>
  <kb-validity state="valueMissing">An image is required.</kb-validity>
</kb-fileupload>
```

## The value

`file` holds the selected image as a base64 data URL, produced by a `FileReader`
when the user picks something. That one choice explains most of the element's
behavior:

- **It's a string.** Set `file` to a stored data URL to pre-fill the preview when
  editing an existing record, and read it back the same way.
- **The preview is the value.** The preview layer shows exactly when `file` is
  non-empty, so there's no separate "has selection" state to track.
- **Size is your responsibility.** Neither the element nor the inner input
  enforces a maximum — state the limit in the helper text and check it on
  submit, or the form silently posts an oversized payload.

`reset()` clears the file and the invalid state and dispatches `reset`. The
delete button in the corner of the preview does the same for the user.

## Validation

- `required` is the only constraint: with it set and no file chosen, the element
  reports `valueMissing`.
- Read the outcome with `checkValidity()`, `reportValidity()`, `validity` and
  `validationMessage`, like any native control.
- Unlike `<kb-input>` and `<kb-textarea>`, the helper text is **not** hidden
  while invalid — the hint (formats, size limit) stays visible next to the
  error, which is usually what you want here.

## Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | `''` | Field name in the owning form's `FormData`. |
| `file` | `string` | `''` | The image as a base64 data URL. Setting it updates the preview and dispatches `changed`. |
| `required` | `boolean` | `false` | Whether a file must be selected for validity. |
| `width` | `auto` \| `fill` \| length | `auto` | How the target fills its container. |
| `hidden` | `boolean` | `false` | Removes the field from layout and the accessibility tree. |

## Methods

| Method | Returns | Description |
|---|---|---|
| `checkValidity()` | `boolean` | Validates and fires `invalid` if it fails. |
| `reportValidity()` | `boolean` | Validates and reports the problem to the user. |
| `reset()` | `this` | Clears the file and the invalid state, dispatches `reset`. |

## Events

| Event | Fires when | `detail` |
|---|---|---|
| `changed` | a file is chosen or cleared | the base64 data URL |

The payload is the whole image, so prefer a listener that stores it over an arc
that forwards it through several elements.

## Styling

| Custom property | Default | Controls |
|---|---|---|
| `--fileupload-aspect-ratio` | `1.95/1` | Shape of the drop target **and** the preview — keep them equal so the box doesn't jump when an image lands. |
| `--fileupload-color-background` | `transparent` | Background of the empty target. |
| `--fileupload-color-border` | `var(--color-master-light)` | Border of the target. |
| `--fileupload-color-border_hover` | `var(--color-primary)` | Border on hover — the affordance that it's clickable. |
| `--fileupload-color-icon-background` | `var(--color-primary-lighter)` | Disc behind the upload icon. |
| `--fileupload-border-radius` | `var(--border-radius-sm)` | Corner rounding of target and preview. |
| `--fileupload-space-inset` | `var(--spacing-xl) var(--spacing-md)` | Padding of the target; accepts the full shorthand. |
| `--fileupload-preview-fit` | `cover` | `object-fit` of the preview; `contain` shows the whole image instead of cropping. |
| `--fileupload-space-gap` | `var(--spacing-nano)` | Gap between the target and the validity message. |

```html preview
<div style="--fileupload-aspect-ratio: 1/1; --fileupload-preview-fit: contain;">
  <kb-fileupload name="square">
    <kb-label>Square avatar</kb-label>
  </kb-fileupload>
</div>
```

## States and accessibility

- `hidden` removes the field from layout and from the accessibility tree.
- The inner `<input type="file">` is hidden with `display: none` but stays in
  the DOM, wrapped by the `<label>` — that's what makes the whole target
  clickable and keyboard-reachable. Don't replicate the click by script.
- The label is not associated by `for`/`id` here; the input is nested inside it.
  Slotted `label` content names the control only while it stays inside the
  target — keep it there.
- The preview `<img>` renders with an empty `alt`, so it's announced as
  decorative. The label text is what tells a screen reader user what the field
  holds.
- The delete button sits inside the shadow DOM, so its accessible name can't be
  set from outside — worth knowing when auditing the form.

## Do's and don'ts

| Do | Don't |
|---|---|
| State the size and format limits in the helper text | Assume the element rejects an oversized file — it doesn't |
| Pre-fill `file` with a stored data URL when editing | Rebuild the preview yourself from a separate image element |
| Keep target and preview on the same aspect ratio | Change only one, and let the box resize when an image lands |
| Upload big media to a storage endpoint and submit its URL | Post multi-megabyte base64 inline because it's convenient |
