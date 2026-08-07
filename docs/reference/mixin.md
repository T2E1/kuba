# mixin

```js
import { Headless, Height, Hidden, Template, Value, Width } from '@t2e1/kuba/mixin'
```

Reusable attribute behavior. Each mixin takes a class and returns a subclass
adding one property backed by one attribute — composed in a chain:

```js
class Stack extends Hidden(Width(Height(Echo(HTMLElement)))) {}
```

Order matters only in that each wraps the previous; the properties don't
interact.

## `Hidden(Base)`

Adds `hidden`, reflected from the `hidden` attribute, and mirrors it onto
`internals.states` as a `hidden` custom state.

```css
:host(:state(hidden)) { display: none; }
```

The mixin sets the state; **the element's own stylesheet decides what that
means**. Every kuba element using it applies `display: none`, but the mixin
doesn't impose it.

Setting `hidden = false` also removes the attribute, so the DOM stays consistent
with the property.

| Member | Type | Default |
|---|---|---|
| `hidden` | `boolean` | `false` |

Requires the host to expose `internals` (an `ElementInternals`), which every
kuba element does through a lazy getter.

## `Headless(Base)`

Hides the element unconditionally, by setting `display: none` on it once
connected. For elements that hold or fetch data and render nothing —
`<kb-fetch>`, `<kb-dataset>`, `<kb-filter>`, `<kb-find>`, `<kb-headers>`,
`<kb-on>`, `<kb-redirect>`.

It adds no attribute and no property. There is nothing to configure: an element
using it is invisible by construction.

## `Width(Base)` and `Height(Base)`

Add `width` and `height`, reflected from the matching attributes and applied
directly to the host. Both use `@retouch`, so a size change replays only the
stylesheet, not the markup.

| Member | Type | Default |
|---|---|---|
| `width` | `string` | `'auto'` |
| `height` | `string` | `'auto'` |

Values pass through a `resizing` filter: numeric px/% values are used as-is, and
the keywords `fill` and `hug` normalize to `100%` and `auto`.

## `Value(Base)`

Adds `value`, kept in sync with the `value` attribute. No default, no
transformation — the plainest of the set, for elements whose payload is a single
string.

| Member | Type | Default |
|---|---|---|
| `value` | `string \| undefined` | `undefined` |

## `Template(Base)`

Adds `template`, resolving to the markup of a `<template>` — either the
element's own child, or one referenced by id through the `template` attribute.

```html
<kb-render>
  <template>{name}</template>
</kb-render>

<kb-render template="shared-row"></kb-render>
```

Reading the property returns the template's `innerHTML`, falling back to the
concatenated `outerHTML` of its children.

!> **Frameworks that create the `<template>` in JavaScript can break this.**
React appends template children to the element's own child list instead of into
its `content` fragment, which leaves `innerHTML` empty. The fallback covers the
element case but drops text nodes and whitespace between elements. Reading the
property before the template's content exists returns nothing, and nothing
re-reads it later.

| Member | Type | Description |
|---|---|---|
| `template` | `string` | The resolved markup. Setting the attribute points at a `<template>` by id. |
