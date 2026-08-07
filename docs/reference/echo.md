# echo

```js
import Echo, { dispatchEvent } from '@t2e1/kuba/echo'
```

The declarative wiring layer. `Echo` turns a class into a host that both echoes
its own events onto a shared bus and subscribes to that bus through **arcs**. See
[Events and Echo](/learn/events-and-echo) for the concepts; this page is the
contract.

## `Echo(Base)`

Mixin. Returns a subclass of `Base` that:

- adds `on` to `observedAttributes`,
- connects an arc when `on` changes, disconnecting the previous one,
- echoes every `dispatchEvent` call onto the shared bus, tagged with the
  element's `id`, `name` and tag name,
- tears down every arc on `disconnectedCallback`.

```js
class Counter extends Echo(HTMLElement) {}
```

Every kuba custom element is built on it, which is why any of them can be an
arc's source or sink without extra setup.

## The arc grammar

```
source/event:type/sink|filter=value|filter=value
```

| Segment | Accepts | Meaning |
|---|---|---|
| `source` | `*`, `#id`, a `name`, a tag name | Which element's events to listen for. Case-insensitive. |
| `event` | any event type | The event name on the shared bus. |
| `type` | `method`, `setter`, `attribute` | How the payload is applied. |
| `sink` | a method, property or attribute name | What to apply it to, on the host. |
| `filter` | `name=value` pairs, `\|`-separated | Transforms applied to the payload, in order. |

The three `type` values:

| `type` | Effect on the host |
|---|---|
| `method` | `this[sink](payload)` |
| `setter` | `this[sink] = payload` |
| `attribute` | `this.setAttribute(sink, payload)` |

An arc that doesn't match the grammar is silently ignored — there is no parse
error.

## Filters

Resolved by name through the [`spark`](/reference/spark) registry and applied
left to right, each receiving `(payload, value)`.

```html
<kb-text on="user/changed:setter/textContent|prop=email"></kb-text>
```

!> An unknown filter name resolves to the identity function rather than
throwing, so a typo leaves the payload untouched with no error.

Filters are synchronous payload transforms. They cannot delay, drop or batch a
call, so **debouncing an arc is not possible** — throttle inside the sink method
instead.

## `dispatchEvent(eventName)`

Method or accessor decorator. Re-dispatches the decorated method's return value
— or the setter's new value — as a bubbling, composed `CustomEvent`, once the
host is connected.

```js
@dispatchEvent('clicked')
click() {
  return this.value
}
```

It makes a property or method observable through arcs without writing
`dispatchEvent` by hand.

## The bus

Arcs don't subscribe to elements; they subscribe to a shared in-memory target.
Every Echo host re-dispatches its events there wrapped with identity
information, and each arc filters by its `source` segment.

Two consequences worth knowing:

- **No element reference is needed.** A subscriber can be declared before its
  source exists, or in a different part of the tree entirely.
- **Events reach the bus even across shadow boundaries**, since it isn't DOM
  propagation.

!> **The bus is global, and `source` matches by identity, not by proximity.** An
arc whose source is `users` fires for *every* element on the page named `users`
— in another component, another feature, another instance of the same widget.
There is no scoping mechanism, so names have to carry the scope themselves:
prefix them per feature (`checkout-items`, not `items`) whenever a page can hold
more than one of something.

## Lifetime

Each arc gets its own `AbortController`, stored per arc string. Changing the
`on` attribute aborts the old subscription and creates the new one;
disconnecting the element aborts all of them. There is nothing to unsubscribe
manually, and a removed element leaves no listener behind.
