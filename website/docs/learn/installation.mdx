# Installation

kuba ships as ES modules with no build step required. Pick whichever of the two
setups matches your project.

## From a CDN

The fastest path, and the one this documentation itself uses: two tags in your
page, no tooling at all.

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@t2e1/kuba@0.2.0-alpha.4/dist/kuba.css"
/>
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@t2e1/kuba@0.2.0-alpha.4/dist/kuba.js"
></script>
```

The stylesheet carries the design tokens (`--color-*`, `--spacing-*`,
`--font-size-*`…) that every component's defaults resolve against. Without it,
components render unstyled — they reference tokens that don't exist.

The script registers every custom element. It's a module, so it's deferred by
default and elements upgrade as soon as it evaluates, whether they were in the
initial HTML or added later.

?> **Pin the version.** kuba is in alpha and breaking changes ship regularly —
event names and tag names have both changed. `@latest` means your page changes
without you touching it.

## From npm

```bash
npm install @t2e1/kuba
```

Import the whole library, which registers all elements:

```js
import '@t2e1/kuba'
import '@t2e1/kuba/dist/kuba.css'
```

Or import only the primitive packages you need, without registering any element:

```js
import { define, connected } from '@t2e1/kuba/directive'
import { paint, repaint } from '@t2e1/kuba/dom'
import { Hidden, Width } from '@t2e1/kuba/mixin'
```

The subpath exports are `cookie`, `directive`, `dom`, `echo`, `event`,
`middleware`, `mixin`, `renderer`, `result`, `router` and `spark`. See
**[Reference › Packages](/build-elements/)** for what each one contains.

## Verifying the install

Drop this in a page. If you see a button that logs when clicked, everything is
wired.

```html preview
<kb-button id="ping" value="pong">Click me</kb-button>
<kb-text id="ping-output" size="xxs" color="master">not clicked yet</kb-text>

<script type="module">
  const button = document.querySelector('#ping')
  const output = document.querySelector('#ping-output')
  button.addEventListener('clicked', (event) => {
    output.textContent = `clicked, detail: ${event.detail}`
  })
</script>
```

If the button renders as plain text instead of a styled control, the script
didn't load or hasn't evaluated yet. If it renders unstyled — right shape, wrong
colors and spacing — the stylesheet is missing.

## Browser support

kuba uses custom elements, shadow DOM, `ElementInternals`, custom states
(`:state()`) and constructable stylesheets, with no polyfills for any of them
beyond a small `setImmediate` shim. That means current Chrome, Edge, Firefox and
Safari. There is no legacy build, and there won't be one — the library exists to
use these APIs, not to abstract over their absence.

## TypeScript

Types are hand-written and shipped with the package. Each element's public
contract lives in its own `types.d.ts`, and the tag is registered in
`HTMLElementTagNameMap`, so `document.querySelector('kb-input')` is typed
without any extra setup.
