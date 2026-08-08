<p align="center">
  <img src="https://avatars.githubusercontent.com/u/305539252?s=200&v=4" alt="kuba logo" width="120" height="120">
</p>

# kuba

> The web platform is the framework.

**kuba** is a lightweight ecosystem of Web Components primitives built around a single idea: the DOM already knows how to communicate — you just need to listen.

Instead of managing state in JavaScript, kuba embraces the browser's native event system as its dataflow layer. Components speak to each other through DOM events. The server remains the source of truth. No virtual DOM. No hydration. No build step required to run.

## Documentation

**[t2e1.github.io/kuba](https://t2e1.github.io/kuba/)** is the single source of truth for how kuba behaves and why — in English, Português and Español.

- **[Learn](https://t2e1.github.io/kuba/#/learn/introduction)** — introduction, installation, quick start
- **[Foundations](https://t2e1.github.io/kuba/#/foundations/principles)** — principles, naming, events and Echo, design tokens
- **[Build UI](https://t2e1.github.io/kuba/#/components/)** — every custom element, with live examples
- **[Build Elements](https://t2e1.github.io/kuba/#/build-elements/)** — the packages you build your own elements from

## Installation

```sh
npm install @t2e1/kuba
```

```js
import '@t2e1/kuba'
```

Or straight from a CDN, no build step:

```js
import 'https://cdn.jsdelivr.net/npm/@t2e1/kuba/+esm'
```

Either way, importing the package registers every custom element — drop the tags directly into your HTML. See [Installation](https://t2e1.github.io/kuba/#/learn/installation) for the stylesheet and the fonts.

## What it looks like

A complete feature — search dog breeds as you type and render the results — wired entirely in HTML, with no JavaScript written by you:

```html
<kb-input name="dog" width="fill">
  <kb-label>Dog Breed Search</kb-label>
</kb-input>

<kb-render layout="grid">
  <template>
    <kb-card>
      <kb-text family="highlight" size="xs">{name}</kb-text>
      <kb-text size="xxxs"><strong>Temperament:</strong> {temperament}</kb-text>
    </kb-card>
  </template>
  <kb-on value="api/succeeded:method/render"></kb-on>
</kb-render>

<kb-fetch name="api" url="https://api.thedogapi.com/v1/breeds/search?q={}">
  <kb-headers key="x-api-key" value="DEMO-API-KEY"></kb-headers>
  <kb-on value="dog/changed:method/get"></kb-on>
</kb-fetch>
```

Every connection is an **arc** — `source/event:type/sink`. `<kb-input name="dog">` publishes `changed`; `<kb-fetch>` subscribes with `dog/changed:method/get` and fetches. `<kb-fetch name="api">` publishes `succeeded`; `<kb-render>` subscribes with `api/succeeded:method/render` and paints its `<template>` once per result.

No component references another in code — they only agree on event names. **[The full example, running →](https://t2e1.github.io/kuba/#/build-ui/patterns/search-as-you-type)**

## Two schools of thought, and the gap between them

Modern frontend development has converged on two competing philosophies, and each one solves only half of the problem.

**React, Vue, and Angular** treat the DOM as an implementation detail to be abstracted away. State lives in JavaScript, and the UI is a pure function of that state, reconciled back into real elements through a virtual DOM. This gives teams a genuinely powerful dataflow model — but the cost is a parallel universe: a runtime shipped to the browser, a build step, and a state model that has nothing to do with the DOM it eventually produces. The HTML the browser receives is no longer the application; it is a rendering target.

**htmx** goes the opposite direction. It restores HTML as the application: the server renders markup, the client swaps fragments of it in place, and no client-side state model is needed at all. But it has no dataflow *inside* the client. Two elements on the same page cannot react to one another without a trip back to the server, so interactivity that should be instantaneous and local — a filter reacting to an input — is modeled as a network request, because there is no other channel available.

kuba closes exactly that gap: **client-side dataflow without leaving HTML, and without a JavaScript state runtime to maintain it.** The browser has had the mechanism since 1995 — the DOM event system. Frameworks reinvented it in userland because raw events are too unstructured to compose an application from: there is no shared vocabulary for *which* element reacts to *which* event, or *how*. kuba standardizes that vocabulary and leaves the mechanism alone. The delivery is the browser's own `CustomEvent`; kuba only supplies the grammar for expressing intent.

The argument in full — including how the DOM event system closes the gap — is in the [Introduction](https://t2e1.github.io/kuba/#/learn/introduction); the grammar itself is in [Events and Echo](https://t2e1.github.io/kuba/#/foundations/events-and-echo).

## Packages

kuba ships as one npm package (`@t2e1/kuba`) but is internally organized as many small packages under `packages/` — custom elements (`kb-` when visual, `k-` when headless) and the utilities they are built from, each independently importable through its own subpath export:

```js
import { css, html } from '@t2e1/kuba/dom'
```

**[The full package map →](https://t2e1.github.io/kuba/#/build-elements/)**

## Contributing

kuba is written in plain JavaScript with zero runtime dependencies. See [CONTRIBUTING.md](./CONTRIBUTING.md) for the development setup and guidelines, and [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) for how we work together.

Found a security issue? [SECURITY.md](./SECURITY.md).

## License

[MIT](./LICENSE) © [Cleber de M. Goncalves](https://github.com/deMGoncalves)
