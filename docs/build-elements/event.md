# event

```js
import on, {
  customEvent,
  dataset,
  detail,
  files,
  formData,
  prevent,
  stop,
  value,
} from '@t2e1/kuba/event'
```

Listening inside your own component, and building the events it publishes.
Where [`echo`](/build-elements/echo) connects *elements*, this package connects an
element to *its own* shadow DOM.

## `on.<type>(selector, ...filters)`

Method decorator factory. `on` is a proxy, so any event type works:
`on.click`, `on.input`, `on.submit`, `on.clicked`.

```js
@on.input('input', value)
[change](newValue) {
  this.value = newValue
  return this
}
```

| Parameter | Type | Description |
|---|---|---|
| `type` | property name | The event type to listen for. |
| `selector` | `string` | Matched against `event.target`; the method runs only on a match. |
| `...filters` | `(event) => unknown` | Applied in order; the result is the method's argument. |

Three properties that define its behavior:

- **The listener is on `shadowRoot`, not the host.** It only sees events
  originating inside the component. An event dispatched on the host itself never
  triggers it.
- **It's delegation.** The selector is matched at dispatch time, so elements
  added by a later repaint are covered without rebinding.
- **Teardown is automatic.** The listener is scoped to an `AbortController` that
  aborts on `disconnectedCallback`.

## Filters

Each transforms the event before the method receives it. They compose left to
right.

| Filter | Produces |
|---|---|
| `value` | `event.target.value` |
| `files` | `event.target.files` |
| `formData` | the form's data, parsed into a plain object |
| `dataset` | `event.target.dataset` |
| `detail` | `event.detail` |
| `prevent` | the event, after `preventDefault()` |
| `stop` | the event, after `stopPropagation()` |

A single declaration can express intercept-and-parse:

```js
@on.submit('form', prevent, stop, formData)
[submitted](data) {
  this.dispatchEvent(customEvent('submitted', data))
  return this
}
```

## `customEvent(type, detail?)`

Builds a `CustomEvent` that **bubbles** and is **cancelable**, so it behaves
like a native event when dispatched from inside a shadow tree.

```js
this.dispatchEvent(customEvent('changed', this.value))
```

| Parameter | Type | Description |
|---|---|---|
| `type` | `string` | Event name. Use the past tense — see the [event naming convention](/foundations/events-and-echo). |
| `detail` | `unknown` | Payload delivered as `event.detail`. |

Prefer this over `new CustomEvent` so every event in the library carries the
same propagation options.
