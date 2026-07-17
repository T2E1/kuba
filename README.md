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

## Two schools of thought, and the gap between them

Modern frontend development has converged on two competing philosophies, and each one solves only half of the problem.

**React, Vue, and Angular** treat the DOM as an implementation detail to be abstracted away. State lives in JavaScript. The UI is a pure function of that state, re-rendered through a virtual DOM and reconciled back into real elements. This gives teams a genuinely powerful dataflow model — components can react to each other, compose, and update predictably. But the cost is a parallel universe: a runtime that must be shipped to the browser, a build step that must compile JSX or templates into JavaScript, and a state model that has nothing to do with the DOM it eventually produces. The HTML the browser receives is no longer the application; it is a rendering target.

**htmx** goes the opposite direction. It restores HTML as the application: the server renders markup, the client swaps fragments of it in place, and no client-side state model is needed at all. This is a return to the web's original request/response model, and it is a legitimate rejection of frontend complexity. But it comes with a real limitation: htmx has no dataflow *inside the client*. Two elements on the same page cannot react to one another without a trip back to the server for a new fragment. Interactivity that should be instantaneous and local — a filter reacting to an input, a counter reacting to a toggle — is modeled as a network request, because there is no other channel available.

The gap between these two schools is exactly the gap kuba closes: **client-side dataflow without leaving HTML, and without a JavaScript state runtime to maintain it.**

---

## How kuba resolves the gap

The browser has had a dataflow mechanism since 1995: the DOM event system. Every element can dispatch an event; every element can listen for one. Frameworks reinvented this capability in userland (props, stores, observables) because raw DOM events, on their own, are too unstructured to compose an application from — there is no shared vocabulary for *which* element should react to *which* event, or *how*.

kuba's answer is to standardize that vocabulary, not replace the mechanism. Every kuba custom element understands a declarative wiring attribute that describes, in plain markup, which source element's event should drive which sink property, method, or attribute on itself. The browser's native `CustomEvent` system does the actual delivery; kuba only supplies the grammar for expressing intent.

The consequence is a dataflow model that is:

- **Client-side**, like React/Vue/Angular — components react to each other instantly, with no server round-trip required for local interactivity.
- **HTML-first**, like htmx — the wiring lives in markup, not in a JavaScript state tree; there is nothing to compile, hydrate, or reconcile.
- **Native**, unlike either — there is no framework-specific event bus underneath; it is the DOM's own event system, exposed rather than hidden.

This is why kuba is best understood as an evolution rather than a third alternative sitting beside the other two: it takes the dataflow ambition of the component frameworks and the platform-fidelity of htmx, and satisfies both with the one mechanism the browser already shipped for exactly this purpose.

---

## Installation

```sh
npm install @t2e1/kuba
```

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
