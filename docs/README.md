# kuba

Web Components primitives and custom elements. No framework, no build step —
the browser is the runtime, HTML is the API.

A complete feature — search dog breeds as you type and render the results —
wired entirely in HTML, with no JavaScript written by you. Type in it:

```html preview
<kb-stack direction="column" spacing="xs">
  <kb-input name="dog" value="american" width="fill">
    <kb-label>Dog Breed Search</kb-label>
    <kb-helper>Try 'akita' or 'corgi'.</kb-helper>
  </kb-input>

  <kb-render layout="grid">
    <template>
      <kb-card>
        <kb-inset side="top">
          <kb-cover src="{image.url}"></kb-cover>
        </kb-inset>
        <kb-text family="highlight" weight="medium" size="xs" color="primary-dark">{name}</kb-text>
        <kb-stack direction="column" spacing="quarck">
          <kb-text size="xxxs"><strong>Bred for:</strong> {bred_for}</kb-text>
          <kb-text size="xxxs"><strong>Life span:</strong> {life_span}</kb-text>
          <kb-text size="xxxs"><strong>Temperament:</strong> {temperament}</kb-text>
        </kb-stack>
      </kb-card>
    </template>
    <kb-on value="api/succeeded:method/render"></kb-on>
    <kb-on value="api/failed:method/clear"></kb-on>
  </kb-render>
</kb-stack>

<kb-fetch name="api" url="https://api.thedogapi.com/v1/breeds/search?q={}">
  <kb-headers key="x-api-key" value="DEMO-API-KEY"></kb-headers>
  <kb-on value="dog/changed:method/get"></kb-on>
</kb-fetch>
```

Every connection is an **arc** — `source/event:type/sink`:

- `<kb-input name="dog">` publishes a `changed` event; `<kb-fetch>` subscribes
  with `dog/changed:method/get` and fetches `…/search?q={the typed value}`.
- `<kb-fetch name="api">` publishes `succeeded` (or `failed`); `<kb-render>`
  subscribes with `api/succeeded:method/render` to paint its `<template>` once
  per result, and with `api/failed:method/clear` to empty it.
- The `{name}`, `{bred_for}`, `{temperament}`… placeholders in the template are
  filled from each result object.

No component references another in code — they only agree on event names. The
same feature is taken apart step by step in
**[Search as you type](/build-ui/patterns/search-as-you-type)**.

Everything on this site runs against the published package, loaded from a CDN —
the same two lines you would put in your own page. If an example here renders,
the release works.

## What it is

kuba is a set of custom elements and the small primitives they're built from:
decorators for the custom element lifecycle, a mixin set for common attributes,
an event layer, and a declarative wiring system called Echo.

- **Components are HTML.** `<kb-input name="email" required>` is the whole API —
  attributes in, events out. There is no component instance to import, no props
  object, no render function.
- **Components talk through events.** No element imports another. They agree on
  event names, and Echo connects them from markup: `on="query/changed:method/get"`.
- **Styling is CSS custom properties.** Every visual decision is a token you can
  override from the outside; nothing requires reaching into a shadow root.

## Start here

- **[Introduction](/learn/introduction)** — why it exists, and the gap it
  occupies between a framework and plain HTML.
- **[Installation](/learn/installation)** — a script tag, or a package install.
- **[Quick start](/learn/quick-start)** — build a working form in ten minutes.
- **[Lifecycle](/build-elements/lifecycle)** — what happens between `define` and paint.
- **[Components](/components/)** — every element, with live examples.
- **[Patterns](/build-ui/patterns/)** — complete recipes for real screens.

## What it is not

kuba is not a React alternative in the sense of replacing a component model —
there is no virtual DOM, no reactivity system, no reconciliation. State lives in
the DOM and in your own objects. If your app needs derived state graphs and
fine-grained re-rendering, use a framework designed for that; kuba is for
building interfaces out of elements the platform already understands.
