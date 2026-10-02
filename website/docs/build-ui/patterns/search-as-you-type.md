---
description: "Cookbook recipe: a search field that queries an API as you type and renders the results from a template, wired with three Echo arcs and no JavaScript."
---

<script setup>
const steps = [
  { node: { tag: 'kb-input', name: 'breed', note: 'you type "corgi"' } },
  { arcs: [{ arc: 'breed/changed:method/get', payload: 'detail: "corgi"' }] },
  {
    node: {
      tag: 'kb-fetch',
      name: 'dogs',
      note: 'GET with the payload in {}',
      external: { host: 'api.thedogapi.com', path: '/v1/breeds/search?q=corgi' },
    },
  },
  {
    arcs: [
      { arc: 'dogs/succeeded:method/render', payload: 'detail: [{ name, temperament }, …]', kind: 'ok' },
      { arc: 'dogs/failed:method/clear', payload: 'detail: the error', kind: 'fail' },
    ],
  },
  { node: { tag: 'kb-render', name: 'results', note: 'one card per item' } },
]
</script>

# Search as you type

An input that queries an API on every keystroke, renders the results from a
template, and clears them when the request fails. Three elements, three arcs, no
JavaScript.

## The code, block by block

### 1. The input publishes

`<kb-input>` dispatches `changed` on every keystroke, with the current value as
the payload. Naming it matters — `name="breed"` is what an arc's `source`
segment matches against. The `<kb-stack>` around it only lays things out; it
takes no part in the wiring.

```html
<kb-stack direction="column" spacing="xs" width="fill">
  <kb-input name="breed" width="fill" placeholder="Try 'akita' or 'corgi'">
    <kb-label>Search dog breeds</kb-label>
    <kb-helper>Results update as you type.</kb-helper>
  </kb-input>
```

### 2. The renderer subscribes to the outcome

`<kb-render>` interpolates its `<template>` once per item in an array, so a list
needs no loop: `{name}` and `{temperament}` are read from each item of the
response. Its two arcs say what to do with each outcome of the request —
`succeeded` renders the list, `failed` clears it.

```html
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
```

Wiring `failed` to `clear` is what keeps stale results from lingering under a
failed query. Skip it and a network error leaves the previous matches on screen,
looking current.

### 3. The fetch subscribes and requests

`<kb-fetch>` renders nothing. Its arc calls `get` with the input's value, and
`{}` in the `url` — the empty placeholder — is replaced by that whole payload.
When the response arrives it publishes `succeeded` with the parsed data, or
`failed` with the error.

```html
<kb-fetch name="dogs" url="https://api.thedogapi.com/v1/breeds/search?q={}">
  <kb-headers key="x-api-key" value="DEMO-API-KEY"></kb-headers>
  <kb-on value="breed/changed:method/get"></kb-on>
</kb-fetch>
```

Each new request aborts the one in flight, so out-of-order responses can't
overwrite newer results — the thing you'd otherwise write by hand with an
`AbortController` and a sequence number.

## The dataflow

<Dataflow :steps="steps" caption="None of the three elements holds a reference to another. Each one only knows the name of the source it listens to." />

| Arc | Reads as |
|---|---|
| `breed/changed:method/get` | when `breed` changes, call this fetch's `get` with the new value |
| `dogs/succeeded:method/render` | when `dogs` succeeds, render the template once per item |
| `dogs/failed:method/clear` | when `dogs` fails, clear what was rendered |

## Try it

Type a breed. Every keystroke is a real request to The Dog API.

```html preview
<kb-stack direction="column" spacing="xs" width="fill">
  <kb-input name="breed" width="fill" placeholder="Try 'akita' or 'corgi'">
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
  <kb-headers key="x-api-key" value="DEMO-API-KEY"></kb-headers>
  <kb-on value="breed/changed:method/get"></kb-on>
</kb-fetch>
```

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

An API needing a key takes a `<kb-headers>` child, one per header name.

::: warning
A key in markup is visible to anyone who opens the page. Use this only for
public, rate-limited demo keys; anything real belongs behind your own endpoint.
:::

## Related

- [Events and Echo](/foundations/events-and-echo) — the arc grammar in full.
- [Fetch](/components/fetch) — every attribute and event.
- [Address by CEP](/build-ui/patterns/address-by-cep) — the same request
  pattern, with the response spread across a form.
