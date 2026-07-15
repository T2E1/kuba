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

## Why kuba?

| | React / Vue / Angular | htmx | **kuba** |
|---|---|---|---|
| State management | In JS (useState, Vuex…) | On the server | **DOM events** |
| Components | JS-first | HTML-first | **Web Components** |
| Build required | Yes | No | **No** |
| Backend agnostic | Yes | Yes | **Yes** |
| Design system included | No | No | **Yes** |
| Ecosystem | Framework-specific | Minimal | **Composable primitives** |

kuba is not a framework. It is the layer that sits between your HTML and your server — invisible, composable, and replaceable piece by piece.

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
<k-button>Click me</k-button>
<k-card>
  <k-text>Hello, world.</k-text>
</k-card>
```

### Utilities (tree-shakeable)

Each utility is available as a subpath export:

```js
import { html, css } from '@t2e1/kuba/dom'
import { router }    from '@t2e1/kuba/router'
import { spark }     from '@t2e1/kuba/spark'
import { echo }      from '@t2e1/kuba/echo'
```

---

## Packages

### Custom elements

| Group | Elements |
|-------|----------|
| `component` | `button`, `card`, `cover`, `footer`, `header`, `icon`, `logo`, `progress`, `stack`, `text` |
| `form` | `form`, `input`, `label`, `textarea`, `validity`, `fileupload` |
| `data` | `dataset`, `filter`, `find` |
| `layout` | `main`, `inset` |
| `behavior` | `on`, `redirect`, `render`, `load`, `helper` |

### Utilities

| Package | Description |
|---------|-------------|
| `dom` | HTML and CSS template tag helpers, paint lifecycle |
| `router` | Client-side routing via URL and params |
| `echo` | DOM event dispatcher and listener primitives |
| `event` | Custom event factories and detail helpers |
| `spark` | Pure functional utilities (equals, diff, add…) |
| `middleware` | Composable function pipelines (before, after, around) |
| `mixin` | Class mixins for common element behaviors |
| `directive` | Attribute-based directives for custom elements |
| `renderer` | Low-level rendering primitives |
| `result` | Result type for error handling without exceptions |
| `storage` | Reactive localStorage/IndexedDB abstraction |
| `cookie` | Cookie read/write utilities |
| `polyfill` | Browser compatibility shims |
| `pixel` | Responsive design utilities |

---

## The Dataflow Model

kuba does not have a state management library. It has the DOM.

Components communicate exclusively through **native DOM events**. A `k-button` dispatches a `click`. A `k-form` listens and reacts. The `echo` package provides the primitives to wire this up without coupling components together.

```js
import { echo } from '@t2e1/kuba/echo'
import { on }   from '@t2e1/kuba/echo'

// dispatch
echo('user:login', { id: 42 })

// listen
on('user:login', ({ detail }) => console.log(detail.id))
```

No stores. No subscriptions to manage. No framework lifecycle to fight. Just events — the same model the browser has used since 1995, now first-class.

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
