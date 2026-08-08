# Events and Echo

kuba elements never import each other. They dispatch events, and Echo connects
them from markup. This page explains both halves: the events a component
publishes, and the arc grammar that subscribes to them.

## Events are the public API

Every kuba component that does something dispatches a `CustomEvent` describing
what happened, with the relevant value as `detail`. The events bubble and are
composed, so they cross shadow boundaries like native ones.

The names are always **past tense** — they report a fact, they don't request an
action:

| Element | Event | `detail` |
|---|---|---|
| `<kb-button>`, `<kb-card>` | `clicked` | the element's `value` |
| `<kb-input>`, `<kb-textarea>`, `<kb-fileupload>` | `changed` | the new value |
| `<kb-form>` | `submitted` | the parsed form data |
| `<kb-form>` | `resetted` | `{}` |
| `<kb-dataset>` | `changed` | the full record collection |
| `<kb-filter>` | `filtered` | the matching records |
| `<kb-find>` | `found` | the matching record |
| `<kb-fetch>` | `succeeded` | the parsed response body |
| `<kb-fetch>` | `failed` | `null` — see [Fetch](/components/fetch) |

?> `<kb-filter>` and `<kb-find>` dispatch on their **parent**, not on
themselves — the one exception to the rule above. An arc's `source` must name
the parent collection.

You can consume any of them the ordinary way:

```js
document.querySelector('kb-form').addEventListener('submitted', (event) => {
  save(event.detail)
})
```

## The arc

Echo's alternative is declarative. Every element is an Echo host: it observes an
`on` attribute whose value is an **arc**.

```
source/event:type/sink|filter=value
```

Read left to right: *when `source` dispatches `event`, apply `sink` on me, using
`type`, after passing the payload through the filters.*

```html
<kb-render on="results/succeeded:method/render"></kb-render>
```

A `<kb-on>` child does the same thing and is easier to read when an element has
several arcs — one per line, instead of a long attribute:

```html
<kb-render>
  <kb-on value="api/succeeded:method/render"></kb-on>
  <kb-on value="api/failed:method/clear"></kb-on>
  <template>{name}</template>
</kb-render>
```

### `source` — which element to listen to

| Form | Matches |
|---|---|
| `*` | any element |
| `#id` | the element whose `id` is `id` |
| `name` | the element whose `name` attribute is `name` |
| `tag-name` | any element of that tag |

Matching is case-insensitive and happens on a shared bus: every Echo host echoes
its own dispatches onto it, tagged with its `id`, `name` and tag name.

### `type` — how the payload is applied

| `type` | Effect |
|---|---|
| `method` | calls `this[sink](payload)` |
| `setter` | assigns `this[sink] = payload` |
| `attribute` | calls `this.setAttribute(sink, payload)` |

### Filters — transforming the payload

Filters are `|`-separated `name=value` pairs, applied in order, each a function
of `(payload, value)`:

```html
<kb-text on="user/changed:setter/textContent|prop=email"></kb-text>
```

The available names come from the `spark` registry: `prop`, `equals`,
`different`, `not`, `truthy`, `len`, `add`, `subtract`, `inc`, `dec`, `gt`,
`gte`, `lt`, `lte` and `always`. Register your own at runtime:

```js
import spark from '@t2e1/kuba/spark'

spark.set('uppercase', (value) => String(value).toUpperCase())
```

!> **An unknown filter name is silently ignored.** `spark.get` falls back to the
identity function rather than throwing, so a typo — or a filter that doesn't
exist — leaves the payload untouched and gives you no error. Check the name
first when an arc "works but does nothing".

?> **There is no `debounce` filter, and there cannot be one.** Filters are
synchronous transforms of the payload; they can't delay or drop the call to the
sink. To throttle a per-keystroke `changed` event, do it inside the sink method
or use a plain listener.

## When to use which

Arcs are worth it when the connection is **structural** — this element always
reacts to that one, and a reader of the HTML should see it. That's most of the
wiring in a kuba page, and it's why the markup is the architecture diagram.

Reach for a listener instead when:

- the payload needs real logic before use (more than a filter chain),
- you need to await something, debounce, or handle an error path,
- the reaction isn't a single method call on one element.

Mixing the two is normal. A form usually has arcs for its display wiring and one
listener for the actual submit.

## Lifetime

Each arc gets its own `AbortController`. Changing the `on` attribute tears down
the old subscription and creates the new one; disconnecting the element tears
down all of them. You never unsubscribe manually, and a removed element leaves
no listener behind.

## A worked example

Two elements, no script: typing in the input publishes `changed`, the fetch
subscribes to it and requests, then publishes `succeeded`, which the renderer
subscribes to.

```html preview
<kb-input name="breed" placeholder="Try 'akita'">
  <kb-label>Search dog breeds</kb-label>
</kb-input>

<kb-render>
  <kb-on value="api/succeeded:method/render"></kb-on>
  <kb-on value="api/failed:method/clear"></kb-on>
  <template>
    <kb-text size="xxs">{name}</kb-text>
  </template>
</kb-render>

<kb-fetch name="api" url="https://api.thedogapi.com/v1/breeds/search?q={}">
  <kb-headers key="x-api-key" value="DEMO-API-KEY"></kb-headers>
  <kb-on value="breed/changed:method/get"></kb-on>
</kb-fetch>
```

Three elements, three arcs, zero imports between them. Swap the fetch for a
different data source and nothing else changes — the contract is the event name.

## Next

- **[Decorators](/build-elements/decorators)** — `@on` for listening inside your own
  component, and the middleware decorators.
- **[Cookbook › Search as you type](/build-ui/patterns/search-as-you-type)** — the
  example above, built up step by step with error and empty states.
