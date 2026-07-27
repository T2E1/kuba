<p align="center">
  <img src="https://avatars.githubusercontent.com/u/305539252?s=200&v=4" alt="kuba logo" width="120" height="120">
</p>

# kuba

> The web platform is the framework.

**kuba** is a lightweight ecosystem of Web Components primitives built around a single idea: the DOM already knows how to communicate — you just need to listen.

Instead of managing state in JavaScript, kuba embraces the browser's native event system as its dataflow layer. Components speak to each other through DOM events. The server remains the source of truth. No virtual DOM. No hydration. No build step required to run.

---

## Documentation

The full documentation lives in Storybook — it's the single source of truth for how kuba behaves and why: **[t2e1.github.io/kuba](https://t2e1.github.io/kuba/)**.

Start with the **Guidelines** section (Introduction → Design Principles → Design Tokens → Naming), then browse one live, controllable story per custom element under **Components**, **Form**, **Layout**, **Typography**, and **Behavior**. The **Guides** show multiple elements wired together into small apps.

To run it locally, see [Contributing](#contributing).

---

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

Either way, importing the package registers every custom element — drop the tags directly into your HTML.

---

## Quick start

A complete feature — search dog breeds as you type and render the results — wired entirely in HTML, with no JavaScript written by you:

```html
<kb-stack direction="column">
  <kb-input name="dog" width="fill">
    <kb-label>Dog Breed Search</kb-label>
  </kb-input>

  <kb-render layout="grid">
    <template>
      <kb-card>
        <kb-inset side="top">
          <kb-cover src="{image.url}"></kb-cover>
        </kb-inset>
        <kb-text family="highlight" weight="medium" size="xs" color="primary">{name}</kb-text>
        <kb-stack direction="column" spacing="quarck">
          <kb-text size="xxxs"><strong>Bred for:</strong> {bred_for}</kb-text>
          <kb-text size="xxxs"><strong>Life span:</strong> {life_span}</kb-text>
          <kb-text size="xxxs"><strong>Temperament:</strong> {temperament}</kb-text>
        </kb-stack>
      </kb-card>
    </template>
    <kb-on value="api/ok:method/render"></kb-on>
    <kb-on value="api/error:method/clear"></kb-on>
  </kb-render>
</kb-stack>

<k-fetch name="api" url="https://api.thedogapi.com/v1/breeds/search?q={}">
  <kb-headers key="x-api-key" value="DEMO-API-KEY"></kb-headers>
  <kb-on value="dog/change:method/get"></kb-on>
</k-fetch>
```

Every connection is an **arc** — `source/event:type/sink`:

- `<kb-input name="dog">` publishes a `change` event; `<k-fetch>` subscribes with `dog/change:method/get` and fetches `…/search?q={the typed value}`.
- `<k-fetch name="api">` publishes `ok` (or `error`); `<kb-render>` subscribes with `api/ok:method/render` to paint its `<template>` once per result, and with `api/error:method/clear` to empty it.
- The `{name}`, `{image.url}`, `{temperament}`… placeholders in the template are filled from each result object.

No component references another in code — they only agree on event names. **[See it live →](https://t2e1.github.io/kuba/?path=/docs/behavior-render--docs)**

---

## The HDA Architecture

kuba is designed around **Hypermedia-Driven Applications (HDA)** — an architectural pattern where HTML is not a template, but the application itself.

In an HDA:
- The server sends hypermedia (HTML) as the response
- The client renders it directly — no JSON parsing, no state reconciliation
- Custom elements progressively enhance the document without owning it

This is not a regression to the past. It is a return to what the web was always meant to be — and a step forward for teams who want predictable, accessible, and fast applications without the complexity tax of modern JavaScript frameworks.

---

## Two schools of thought, and the gap between them

Modern frontend development has converged on two competing philosophies, and each one solves only half of the problem.

**React, Vue, and Angular** treat the DOM as an implementation detail to be abstracted away. State lives in JavaScript. The UI is a pure function of that state, re-rendered through a virtual DOM and reconciled back into real elements. This gives teams a genuinely powerful dataflow model — components can react to each other, compose, and update predictably. But the cost is a parallel universe: a runtime that must be shipped to the browser, a build step that must compile JSX or templates into JavaScript, and a state model that has nothing to do with the DOM it eventually produces. The HTML the browser receives is no longer the application; it is a rendering target.

**htmx** goes the opposite direction. It restores HTML as the application: the server renders markup, the client swaps fragments of it in place, and no client-side state model is needed at all. This is a return to the web's original request/response model, and it is a legitimate rejection of frontend complexity. But it comes with a real limitation: htmx has no dataflow *inside the client*. Two elements on the same page cannot react to one another without a trip back to the server for a new fragment. Interactivity that should be instantaneous and local — a filter reacting to an input, a counter reacting to a toggle — is modeled as a network request, because there is no other channel available.

The gap between these two schools is exactly the gap kuba closes: **client-side dataflow without leaving HTML, and without a JavaScript state runtime to maintain it.**

---

## How kuba resolves the gap

The browser has had a dataflow mechanism since 1995: the DOM event system. Every element can dispatch an event; every element can listen for one. Frameworks reinvented this capability in userland (props, stores, observables) because raw DOM events, on their own, are too unstructured to compose an application from — there is no shared vocabulary for *which* element should react to *which* event, or *how*.

kuba's answer is to standardize that vocabulary, not replace the mechanism. Every kuba custom element understands a declarative wiring attribute (`on`) that describes, in plain markup, which source element's event should drive which sink property, method, or attribute on itself. The browser's native `CustomEvent` system does the actual delivery; kuba only supplies the grammar for expressing intent.

The consequence is a dataflow model that is:

- **Client-side**, like React/Vue/Angular — components react to each other instantly, with no server round-trip required for local interactivity.
- **HTML-first**, like htmx — the wiring lives in markup, not in a JavaScript state tree; there is nothing to compile, hydrate, or reconcile.
- **Native**, unlike either — there is no framework-specific event bus underneath; it is the DOM's own event system, exposed rather than hidden.

This is why kuba is best understood as an evolution rather than a third alternative sitting beside the other two: it takes the dataflow ambition of the component frameworks and the platform-fidelity of htmx, and satisfies both with the one mechanism the browser already shipped for exactly this purpose.

---

## Packages

kuba ships as one npm package (`@t2e1/kuba`) but is internally organized as many small, independently-meaningful packages under `packages/`.

### Custom elements

Visual elements use the `kb-` prefix; headless elements (state/data, no rendering) use `k-`.

| Group | Elements |
|-------|----------|
| `component` | `button`, `card`, `cover`, `footer`, `header`, `icon`, `logo`, `progress`, `stack` |
| `form` | `form`, `input`, `textarea`, `validity`, `fileupload` |
| `typography` | `text`, `label`, `helper` |
| `layout` | `main`, `inset` |
| `behavior` | `on`, `redirect`, `render` |
| `data` *(headless)* | `dataset`, `filter`, `find`, `fetch`, `headers` |

### Utilities

Each utility is independently importable via its subpath export (e.g. `import { css } from '@t2e1/kuba/dom'`).

| Package | Description |
|---------|-------------|
| `echo` | The dataflow bus: DOM event dispatcher/listener primitives |
| `dom` | HTML and CSS tagged-template helpers, paint lifecycle |
| `router` | Client-side routing via URL and params |
| `event` | Custom event factories and detail helpers |
| `http` | Fluent HTTP request builder |
| `interpolate` | `{path.to.value}` placeholder substitution (shared by `<kb-render>`, `<kb-form>`, `<kb-redirect>`) |
| `spark` | Pure functional utilities (`equals`, `len`, `not`, `add`…) — usable as `on` filters |
| `middleware` | Composable function pipelines (`before`, `after`, `around`) |
| `mixin` | Class mixins for common element behaviors |
| `directive` | Attribute-based directives for custom elements |
| `renderer` | Low-level rendering primitives |
| `result` | Result type for error handling without exceptions |
| `cookie` | Cookie read/write utilities |
| `polyfill` | Browser compatibility shims |
| `pixel` | CSS reset and design tokens (colors, spacing, typography…), imported as a stylesheet |

---

## Design Principles

- **Platform-first** — if the browser can do it, kuba does not reinvent it
- **Zero opinion on your backend** — works with Rails, Laravel, Django, Go, or a static file server
- **Progressive** — add as little or as much as you need
- **Composable** — every primitive is independently usable
- **Accessible by default** — custom elements are built on semantic HTML

---

## Contributing

kuba is written in plain JavaScript with zero runtime dependencies. See [CONTRIBUTING.md](./CONTRIBUTING.md) for the development setup and guidelines.

## Code of Conduct

See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## License

[MIT](./LICENSE) © [Cleber de M. Goncalves](https://github.com/deMGoncalves)
