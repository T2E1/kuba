# Search as you type

An input that queries an API on every keystroke, renders the results from a
template, and clears them when the request fails. Three elements, three arcs, no
JavaScript.

## The finished thing

```html preview
<kb-stack direction="column" spacing="xs">
  <kb-input name="breed" placeholder="Try 'akita' or 'corgi'">
    <kb-label>Search dog breeds</kb-label>
    <kb-helper>Results update as you type.</kb-helper>
  </kb-input>

  <kb-render>
    <kb-on value="dogs/succeeded:method/render"></kb-on>
    <kb-on value="dogs/failed:method/clear"></kb-on>
    <template>
      <kb-card>
        <kb-text size="xs" weight="bold">{name}</kb-text>
        <kb-text size="xxxs" color="master">{temperament}</kb-text>
      </kb-card>
    </template>
  </kb-render>
</kb-stack>

<kb-fetch name="dogs" url="https://api.thedogapi.com/v1/breeds/search?q={}">
  <kb-on value="breed/changed:method/get"></kb-on>
</kb-fetch>
```

## How it's built

### 1. The input publishes

`<kb-input>` dispatches `changed` on every keystroke, with the current value as
the payload. Naming it matters — `name="breed"` is what an arc's `source`
segment matches against.

```html
<kb-input name="breed" placeholder="Try 'akita'"></kb-input>
```

### 2. The fetch subscribes and requests

`<kb-fetch>` renders nothing. Its `url` carries a `{}` placeholder, replaced by
whatever payload reaches its `get` method — which is exactly the input's value.

```html
<kb-fetch name="dogs" url="https://api.thedogapi.com/v1/breeds/search?q={}">
  <kb-on value="breed/changed:method/get"></kb-on>
</kb-fetch>
```

Each new request aborts the one in flight, so out-of-order responses can't
overwrite newer results — the thing you'd otherwise write by hand with an
`AbortController` and a sequence number.

### 3. The renderer subscribes to the outcome

`<kb-fetch>` publishes `succeeded` with the parsed data, or `failed` with the
error. `<kb-render>` interpolates its `<template>` once per item in an array, so
a list needs no loop:

```html
<kb-render>
  <kb-on value="dogs/succeeded:method/render"></kb-on>
  <kb-on value="dogs/failed:method/clear"></kb-on>
  <template>
    <kb-card>
      <kb-text size="xs" weight="bold">{name}</kb-text>
    </kb-card>
  </template>
</kb-render>
```

Wiring `failed` to `clear` is what keeps stale results from lingering under a
failed query. Skip it and a network error leaves the previous matches on screen,
looking current.

## Things worth knowing

### It fires per keystroke

`changed` is not debounced, and arc filters can't debounce it — they're
synchronous payload transforms and can't defer the call. For a real API, throttle
before requesting. That means dropping the arc for a listener on the input:

```js
let timer
document.querySelector('kb-input').addEventListener('changed', (event) => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    document.querySelector('kb-fetch').get(event.detail)
  }, 300)
})
```

This is the honest boundary of the declarative approach: the moment timing
enters, an arc is the wrong tool. Everything else on the page stays declarative.

### The empty state

`<kb-render>` renders nothing for an empty array, so a query with no matches
leaves a blank space rather than saying "no results". If the distinction matters,
listen for `succeeded` and branch on `detail.length`.

### Headers

An API needing a key takes a `<kb-headers>` child, one per header name:

```html
<kb-fetch name="dogs" url="https://api.thedogapi.com/v1/breeds/search?q={}">
  <kb-headers key="x-api-key" value="YOUR-KEY"></kb-headers>
  <kb-on value="breed/changed:method/get"></kb-on>
</kb-fetch>
```

!> A key in markup is visible to anyone who opens the page. Use this only for
public, rate-limited demo keys; anything real belongs behind your own endpoint.

## Related

- [Events and Echo](/learn/events-and-echo) — the arc grammar in full.
- [Components › Fetch](/components/) — every attribute and event.
