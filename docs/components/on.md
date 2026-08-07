# On

Attaches one additional arc — `source/event:type/sink` — to its parent Echo
host. It renders nothing and never wires anything on its own behalf. If a host
needs only one subscription, use its own `on` attribute instead; `<kb-on>` exists
because an element can carry only one of those.

```html preview
<kb-input name="live" placeholder="Type to see two arcs fire">
  <kb-label>Source</kb-label>
</kb-input>

<kb-render>
  <kb-on value="live/changed:method/render"></kb-on>
  <template>
    <kb-text size="xxs">You typed: {}</kb-text>
  </template>
</kb-render>
```

## Usage

```html
<kb-render>
  <kb-on value="api/succeeded:method/render"></kb-on>
  <kb-on value="api/failed:method/clear"></kb-on>
  <template>{name}</template>
</kb-render>
```

## When to use

- **A host needs a second (or third) subscription** beyond what its own `on`
  attribute can express — the grammar supports exactly one arc per attribute, so
  every additional arc has to be a `<kb-on>` child.
- **Keeping each subscription independently readable** in markup, one per line,
  instead of a long attribute value.

## When not to use

- **A single subscription** — set the host's own `on` attribute. A `<kb-on>`
  child adds an element and an upgrade step for no benefit.
- **Wiring that isn't event-driven.** This only bridges a `CustomEvent` on the
  shared Echo bus to a method, attribute or property on its parent.

## Composition

- **Can contain**: nothing. It has no slot and renders no shadow DOM; it exists
  for its `value` attribute and its effect on `parentElement`.
- **Can be a child of**: any element built with the `Echo` mixin — which is
  every kuba custom element. Under a plain HTML element or a non-Echo custom
  element it has no effect, since wiring targets `parentElement` directly.

It waits for `customElements.whenDefined(parentElement.localName)` before wiring,
so declaring it before the parent has upgraded is safe.

## The arc string

`value` takes the same grammar as the `on` attribute — see
[Events and Echo](/learn/events-and-echo) for the full reference:

```
source/event:type/sink|filter=value
```

| Segment | Meaning |
|---|---|
| `source` | `*` (any), `#id`, a `name`, or a tag name |
| `event` | the event to listen for on the shared bus |
| `type` | `method`, `setter` or `attribute` |
| `sink` | the method, property or attribute to apply on the parent |
| `filter` | optional `\|`-separated transforms, applied in order |

## Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `value` | arc string | — | The arc to attach to the parent Echo host. |

This element dispatches no events and renders nothing.

## Lifetime

Each arc gets its own `AbortController`. Changing `value` tears down the old
subscription and creates the new one; removing the `<kb-on>` — or its parent —
tears it down. There is nothing to unsubscribe manually.

## Do's and don'ts

| Do | Don't |
|---|---|
| Use the host's own `on` attribute for a single subscription | Wrap a single arc in a `<kb-on>` child when the attribute would do |
| Add one `<kb-on>` per extra arc on the same host | Concatenate several arcs into one `on` — the grammar supports one |
| Nest it directly under the Echo host it wires | Place it under a non-Echo element and expect it to work |
