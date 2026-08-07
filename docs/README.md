# kuba

Web Components primitives and custom elements. No framework, no build step —
the browser is the runtime, HTML is the API.

```html preview
<kb-stack direction="row" spacing="xs">
  <kb-button>Primary</kb-button>
  <kb-button variant="outlined">Outlined</kb-button>
  <kb-button variant="link">Link</kb-button>
</kb-stack>
```

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
