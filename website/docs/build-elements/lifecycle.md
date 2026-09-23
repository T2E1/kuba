# Lifecycle

A kuba element has no render loop and no reactivity system. What it has is the
native custom element lifecycle, plus four decorators that decide *when* its
shadow DOM is written. Understanding those four is most of understanding the
library.

## The native lifecycle, unchanged

kuba doesn't replace the platform's callbacks — it wraps them. An element still
goes through:

| Callback | Fires when |
|---|---|
| `constructor` | the element is created or upgraded |
| `connectedCallback` | it is inserted into the document |
| `attributeChangedCallback` | an observed attribute changes |
| `disconnectedCallback` | it is removed from the document |

Every decorator below hooks one of these. Nothing schedules work on its own
outside them, and there is no scheduler you have to think about.

## Registering: `@define`

```js
@define('kb-button')
class Button extends HTMLElement {}
```

`@define` registers the class in the custom element registry — and skips
registration if the tag already exists, so a module evaluated twice (two bundled
copies, a hot reload) doesn't throw.

Nothing happens at definition time beyond registration. Elements already in the
page upgrade at that moment; elements added later upgrade on insertion.

## Painting: `@paint`

```js
@define('kb-button')
@paint(component, style)
class Button extends HTMLElement {}
```

`@paint` takes a **component** function (returns the markup string) and any
number of **style** functions (each returns a `CSSStyleSheet`), and wraps
`connectedCallback` so that, after your own connect logic runs, the element:

1. Runs `willPaintCallback`, if the class defines one.
2. Writes the markup into `shadowRoot.innerHTML` and adopts the stylesheets —
   both deferred to the same `requestAnimationFrame`, so the two land in one
   frame instead of forcing layout mid-callback.
3. Marks itself painted.
4. Runs `didPaintCallback`, if the class defines one.

Both functions receive the element, which is how markup and styles read its
current attributes:

```js
const component = (button) => html`<button>${button.label}</button>`
const style = (button) => css`:host { width: ${button.width}; }`
```

?> **The shadow root does not exist until that frame.** This is the single most
common surprise: querying `shadowRoot.querySelector('button')` synchronously
inside `connectedCallback` returns `null`. Wait for the paint — in tests, poll
with `waitFor`; in code, use `didPaintCallback`.

## Re-painting: `@repaint` and `@retouch`

A setter decorated with `@repaint` re-runs the whole paint — markup and styles —
after the setter returns:

```js
@attributeChanged('use')
@repaint
set use(value) {
  this.#use = value
}
```

`@retouch` is the cheaper half: it replays **only** the stylesheet, leaving the
markup untouched. Use it when a property affects appearance but not structure:

```js
@attributeChanged('size')
@retouch
set size(value) {
  this.#size = value
}
```

`<kb-icon>` uses both, and the split shows why they're separate: `use` changes
the rendered glyph, so it repaints; `size` and `color` only feed CSS custom
properties, so they retouch. Repainting on a color change would rewrite the DOM
for nothing.

Three properties of this design worth knowing:

- **Both are batched.** The work is scheduled with `setImmediate`, so the
  decorated setter returns synchronously and several writes in the same task
  collapse into one paint.
- **Both are guarded by the painted flag.** Writing a property before the first
  paint doesn't trigger a redundant render — the initial paint will pick up the
  value anyway.
- **Neither is reactive.** Nothing tracks what the markup read. The decorator
  re-runs the whole component function; it doesn't diff.

## Reacting to attributes: `@attributeChanged`

```js
@attributeChanged('width')
set width(value) {
  this.#width = value
}
```

This adds the attribute to `observedAttributes` and syncs the property from it on
every `attributeChangedCallback`. Optional filters transform the raw string
first — `booleanAttribute` turns presence into `true`:

```js
@attributeChanged('hidden', booleanAttribute)
set hidden(value) {
  this.#hidden = value
}
```

The direction is attribute → property. Setting the property directly does *not*
write the attribute back.

## Hooking connect and disconnect: `@connected`, `@disconnected`

```js
@connected
[slottable]() {
  this.setAttribute('slot', 'helper')
  return this
}
```

These run a method *after* the corresponding native callback, without
overwriting an implementation that's already there — several decorators can hook
the same callback and they chain. `<kb-helper>` uses `@connected` to assign its
own slot, which is why nesting one inside a field is all the wiring needed.

`@disconnected` is where cleanup belongs. The form controls abort an
`AbortController` there, which unregisters every listener they added to the
owning form in one call.

There are matching directives for the rest of the platform's callbacks:
`@adopted`, `@formAssociated`, `@formDisabled`, `@formReset` and
`@formStateRestore`.

## Putting it together

```js
import { attributeChanged, connected, define } from '@t2e1/kuba/directive'
import { paint, repaint } from '@t2e1/kuba/dom'

@define('my-counter')
@paint(component, style)
class Counter extends HTMLElement {
  #count

  get count() {
    return (this.#count ??= 0)
  }

  @attributeChanged('count')
  @repaint
  set count(value) {
    this.#count = Number(value)
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  @connected
  [ready]() {
    // Runs after connectedCallback, before the first paint lands.
    return this
  }
}
```

The order for an element entering the page: constructor → `attributeChangedCallback`
for each attribute present → `connectedCallback` → your `@connected` hooks →
`willPaintCallback` → markup and styles written in one frame → painted flag →
`didPaintCallback`.

## Next

- **[Events and Echo](/foundations/events-and-echo)** — how elements talk once they're
  on screen.
- **[Decorators](/build-elements/decorators)** — writing your own, and the middleware
  decorators (`@before`, `@after`, `@around`).
