# dom

```js
import { css, html, paint, repaint, retouch } from '@t2e1/kuba/dom'
```

Rendering. `paint` writes an element's shadow DOM once on connect; `repaint` and
`retouch` schedule updates afterwards. See [Lifecycle](/build-elements/lifecycle) for the
sequence.

## `paint(component, ...styles)`

Class decorator. Wraps `connectedCallback` so that, after the element's own
connect logic runs, its shadow DOM is written.

```js
@define('my-counter')
@paint(component, style)
class Counter extends HTMLElement {}
```

| Parameter | Type | Returns |
|---|---|---|
| `component` | `(element) => string` | The markup to write into the shadow root. |
| `...styles` | `(element) => CSSStyleSheet` | Stylesheets adopted by the shadow root. |

Both receive the element, which is how markup and styles read its current
attributes. The sequence per paint:

1. `willPaintCallback`, if defined on the class.
2. Markup and styles written — both deferred to the same
   `requestAnimationFrame`, so they land in one frame.
3. The painted flag is set.
4. `didPaintCallback`, if defined.

!> **The shadow root is empty until that frame.** Querying it synchronously in
`connectedCallback` returns `null`. Use `didPaintCallback`, or wait a frame.

## `repaint`

Method or accessor decorator. Re-runs the full paint — markup and styles — after
the decorated function returns.

```js
@attributeChanged('use')
@repaint
set use(value) { this.#use = value }
```

## `retouch`

The cheaper half: replays **only** the stylesheet, leaving markup untouched. For
properties that affect appearance but not structure.

```js
@attributeChanged('size')
@retouch
set size(value) { this.#size = value }
```

`<kb-icon>` uses both, and the split shows why: `use` changes the rendered glyph
so it repaints; `size` and `color` only feed CSS so they retouch.

Both share three properties:

- **Batched.** Work is scheduled with `setImmediate`, so the decorated function
  returns synchronously and several writes in one task collapse into one paint.
- **Guarded.** Writing a property before the first paint doesn't trigger a
  redundant render.
- **Not reactive.** Nothing tracks what the markup read; the whole component
  function re-runs. There is no diffing.

## `html` and `css`

Tagged template literals. `html` returns a markup string; `css` returns a
`CSSStyleSheet` ready to adopt.

```js
const component = (button) => html`<button>${button.label}</button>`
const style = (button) => css`
  :host { width: ${button.width}; }
`
```

Interpolation is plain string substitution — **values are not escaped**. Never
interpolate untrusted input into `html`.

## Lifecycle callbacks

Optional methods a painted class can define. They're looked up by symbol, so
import the keys when you implement them:

| Symbol | Runs |
|---|---|
| `willPaintCallback` | before each paint |
| `didPaintCallback` | after each paint settles |
| `isPainted` | flag, readable to know whether the first paint completed |

`htmlCallback` and `cssCallback` are internal — stashed on the instance by
`paint` so `repaint` and `retouch` can replay the exact same work.
