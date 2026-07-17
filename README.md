# kuba

> The web platform is the framework.

**kuba** is a lightweight ecosystem of Web Components primitives built around a single idea: the DOM already knows how to communicate — you just need to listen.

Instead of managing state in JavaScript, kuba embraces the browser's native event system as its dataflow layer. Components speak to each other through DOM events. The server remains the source of truth. No virtual DOM. No hydration. No build step required to run.

---

## The HDA Architecture

kuba is designed around **Hypermedia-Driven Applications (HDA)** — an architectural pattern where HTML is not a template, but the application itself.

In an HDA:
- The server sends hypermedia (HTML) as the response
- The client renders it directly — no JSON parsing, no state reconciliation
- Custom elements progressively enhance the document without owning it

This is not a regression to the past. It is a return to what the web was always meant to be — and a step forward for teams who want predictable, accessible, and fast applications without the complexity tax of modern JavaScript frameworks.

---

## The gap kuba closes

Two schools of thought dominate today, and each solves half the problem:

- **React / Vue / Angular** give you rich client-side dataflow — but pull the DOM out of the picture. State lives in JavaScript, HTML becomes a compilation target, and every interaction is mediated by a runtime, a diffing engine, and a build step.
- **htmx** keeps HTML as the application, but has no dataflow *in the client*. Two components on the same page can't talk to each other; every interaction is a request back to the server for a new fragment.

kuba is the piece both are missing: **Web Components that communicate through real, native DOM events** — no virtual DOM, no bundler-mediated state, and no round-trip to the server required just to let one element react to another.

| | React / Vue / Angular | htmx | **kuba** |
|---|---|---|---|
| State lives in | JS runtime (useState, stores…) | The server | **The DOM (native events)** |
| Client-to-client dataflow | Yes, via framework APIs | No — server round-trip only | **Yes — zero-config, via `on`** |
| Components | JS-first, compiled | HTML-first, templated | **Web Components (native)** |
| Build required to run | Yes | No | **No** |
| Backend agnostic | Yes | Yes | **Yes** |
| Design system included | No | No | **Yes** |

kuba is not a framework. It is the layer that sits between your HTML and your server — invisible, composable, and replaceable piece by piece.

---

## The same feature, three ways

A search box that filters a list, live, without reloading the page.

**React** — state lives in JS, every keystroke re-renders:
```jsx
function Search() {
  const [query, setQuery] = useState('')
  const results = useMemo(() => data.filter(matches(query)), [query])
  return (
    <>
      <input onChange={(e) => setQuery(e.target.value)} />
      <List items={results} />
    </>
  )
}
```

**htmx** — state lives on the server, every keystroke is a network request:
```html
<input name="q" hx-get="/search" hx-trigger="keyup changed delay:200ms" hx-target="#results">
<div id="results"></div>
```

**kuba** — state lives in the DOM, wired declaratively, no server round-trip and no JS to write:
```html
<k-dataset upsert="id">
  <k-filter key="name"></k-filter>
</k-dataset>

<kb-input name="q" on="*/change:setter/value"></kb-input>
```

The `on` attribute wires the input's `change` event straight into `k-filter`'s `value` setter — no store, no controller, no request. `k-filter` re-filters `k-dataset`'s collection and dispatches its own `filter` event, which any other element on the page can wire into next.

---

## Installation

```sh
npm install @t2e1/kuba
```

---

## Usage

### Custom elements (full design system)

```js
import '@t2e1/kuba'
```

This registers all kuba custom elements in the browser. Drop them in any HTML page, with any backend.

```html
<kb-button>Click me</kb-button>
<kb-card>
  <kb-text>Hello, world.</kb-text>
</kb-card>
```

### Utilities (tree-shakeable)

Each utility is available as a subpath export:

```js
import { html, css } from '@t2e1/kuba/dom'
import { router }    from '@t2e1/kuba/router'
import { spark }     from '@t2e1/kuba/spark'
import http          from '@t2e1/kuba/http'
```

---

## The Dataflow Model

kuba does not have a state management library. It has the DOM.

Every kuba custom element understands an `on` attribute — an "arc" describing how it reacts to events from other elements on the page, with no JavaScript required:

```
source/event:type/sink
```

- `source` — where the event comes from: `*` (anywhere), `#id`, a `name`, or a tag name.
- `event` — the DOM event type to listen for.
- `type` — how `sink` is applied: `method`, `attribute`, or `setter`.
- `sink` — the method, attribute, or property to invoke on this element.

```html
<kb-input id="q" name="q"></kb-input>

<k-dataset upsert="id">
  <k-filter on="#q/change:setter/value" key="name"></k-filter>
</k-dataset>
```

Every `<kb-input>` change re-dispatches through the shared event bus; `<k-filter>` picks it up because its `on` arc matches `#q`, sets its own `value`, and re-filters the dataset it lives in — all three elements never reference each other in JavaScript.

For imperative cases, the same bus is available directly:

```js
import { echo, on } from '@t2e1/kuba/echo'

echo('user:login', { id: 42 })
on('user:login', ({ detail }) => console.log(detail.id))
```

No stores. No subscriptions to manage. No framework lifecycle to fight. Just events — the same model the browser has used since 1995, now wired declaratively in markup.

---

## Packages

### Custom elements

| Group | Elements |
|-------|----------|
| `component` | `button`, `card`, `cover`, `footer`, `header`, `icon`, `logo`, `progress`, `stack` |
| `form` | `form`, `input`, `textarea`, `validity`, `fileupload` |
| `data` | `dataset`, `filter`, `find`, `fetch` |
| `layout` | `main`, `inset` |
| `behavior` | `on`, `redirect`, `render` |
| `typography` | `text`, `label`, `helper` |

### Utilities

| Package | Description |
|---------|-------------|
| `dom` | HTML and CSS template tag helpers, paint lifecycle |
| `router` | Client-side routing via URL and params |
| `echo` | DOM event dispatcher and listener primitives (the dataflow bus) |
| `event` | Custom event factories and detail helpers |
| `http` | Fluent HTTP request builder |
| `spark` | Pure functional utilities (equals, diff, add…) |
| `middleware` | Composable function pipelines (before, after, around) |
| `mixin` | Class mixins for common element behaviors |
| `directive` | Attribute-based directives for custom elements |
| `renderer` | Low-level rendering primitives |
| `result` | Result type for error handling without exceptions |
| `cookie` | Cookie read/write utilities |
| `polyfill` | Browser compatibility shims |
| `pixel` | Responsive design utilities |

---

## Design Principles

- **Platform-first** — if the browser can do it, kuba does not reinvent it
- **Zero opinion on your backend** — works with Rails, Laravel, Django, Go, or a static file server
- **Progressive** — add as little or as much as you need
- **Composable** — every primitive is independently usable
- **Accessible by default** — custom elements are built on semantic HTML

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Code of Conduct

See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## License

[MIT](./LICENSE) © [Cleber de M. Goncalves](https://github.com/deMGoncalves)
