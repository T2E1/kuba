# Render

Renders content by interpolating a template against arbitrary data, supplied via
`render()` and emptied again via `clear()`. It's an Echo host, so either method
can be wired to another element's event — re-rendering when a data source
publishes `succeeded`, clearing on a `failed` — without a manual listener or a
reactivity system.

```html preview
<kb-render id="greeting-demo">
  <template>
    <kb-text size="xs">Hello, {name}! You have {count} messages.</kb-text>
  </template>
</kb-render>

<script type="module">
  const target = document.querySelector('#greeting-demo')
  requestAnimationFrame(() => target.render({ name: 'Ada', count: 3 }))
</script>
```

## Usage

```html
<kb-render>
  <kb-on value="api/succeeded:method/render"></kb-on>
  <template>{name}</template>
</kb-render>
```

```js
document.querySelector('kb-render').render([{ name: 'Ada' }, { name: 'Grace' }])
```

## When to use

- **Displaying a list or grid of records** whose shape stays the same but whose
  data changes — one template, re-rendered against a new array each time.
- **Wiring rendering to an event** instead of writing a listener plus DOM
  updates by hand.

## When not to use

- **Static content that never changes after first render** — plain HTML needs
  none of this machinery.
- **Content requiring conditional branching or nested structure** beyond simple
  `{path.to.value}` substitution. The template engine only substitutes
  placeholders; it has no `if` or loop syntax beyond "one interpolation per
  array entry".

## Composition

- **Can contain**: a single `<template>` child, and one or more `<kb-on>`
  children for arcs beyond the single `on` attribute.
- **Can be a child of**: anything.

## Template resolution

- **Nest the `<template>` directly as a child** — the common case.
- **Or set `template="some-id"`** to reference a `<template>` declared elsewhere
  in the document, resolved once and cached. Useful when several `<kb-render>`
  instances share one template.

## Data and re-rendering

`render(data)` accepts a single item or an array; a single value is coerced into
a one-item list, so the same interpolation handles one or many entries,
concatenated in order.

```html preview
<kb-render id="list-demo" layout="grid">
  <template>
    <kb-card>
      <kb-text size="xxs" weight="bold">{name}</kb-text>
      <kb-text size="xxxs" color="master">{role}</kb-text>
    </kb-card>
  </template>
</kb-render>

<script type="module">
  const target = document.querySelector('#list-demo')
  requestAnimationFrame(() =>
    target.render([
      { name: 'Ada Lovelace', role: 'Mathematician' },
      { name: 'Grace Hopper', role: 'Rear Admiral' },
    ]),
  )
</script>
```

!> **Calling `render()` before the first paint is a silent no-op.** Call it
after the element is connected — in response to an event, not synchronously at
module load. That's why the examples above wait a frame.

`clear()` empties the rendered content without touching the template, so a later
`render()` still has something to interpolate against. It's the natural
counterpart to wire to a failure event, so a failed request clears stale results
instead of leaving them on screen looking current.

## Layout

`layout` controls how rendered content is arranged, not how it looks.

| Layout | Arrangement | Use for |
|---|---|---|
| `list` (default) | Single flex column | A vertical list of records, one per line. |
| `grid` | Two-column grid | Records better scanned side by side, like paired name/value entries. |

## Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `layout` | `list` \| `grid` | `list` | Arrangement of the rendered items. |
| `template` | `string` | — | Id of a `<template>` elsewhere in the document, used instead of a child one. |
| `hidden` | `boolean` | `false` | Removes the element from layout and the accessibility tree. |
| `on` | arc string | — | Echo wiring, `source/event:type/sink`. |

## Methods

| Method | Returns | Description |
|---|---|---|
| `render(data)` | `this` | Interpolates the template against `data` — one item or an array — and replaces the rendered content. |
| `clear()` | `this` | Empties the rendered content, leaving the template intact. |

This element dispatches no events.

## Styling

| Custom property | Default | Controls |
|---|---|---|
| `--render-space-gap` | `var(--spacing_inset-xs)` | Gap between rendered items, in both layouts. |
| `--render-grid-columns` | `2` | Number of columns in the `grid` layout. No effect on `list`. |

```css
/* A denser, three-column gallery, scoped to one area */
.gallery kb-render {
  --render-grid-columns: 3;
  --render-space-gap: var(--spacing_inset-nano);
}
```

## Do's and don'ts

| Do | Don't |
|---|---|
| Nest a single `<template>` child for the common case | Reference an external node with `template` when a child would do |
| Wire `render()` to a publisher's event via `on` or `<kb-on>` | Write a listener by hand when an arc already covers it |
| Use `layout="grid"` for paired, scannable entries | Use `grid` for long free-form text that gains nothing from columns |
| Call `render()` only after the element is connected | Call it synchronously right after creating the element — it's a no-op before first paint |
