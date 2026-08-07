# Decorators

Decorators are how a kuba element declares its behavior. They fall into four
groups: **lifecycle** (covered in [Lifecycle](/build-elements/lifecycle)), **listening**,
**middleware**, and **dispatching**. This page covers the last three, and how to
write your own.

All of them are standard-ish method/accessor decorators applied to a class
member — no runtime registry, no dependency injection container. Each one wraps
a function.

## Listening: `@on`

`@on` binds a delegated listener on the element's **shadow root**, scoped to an
`AbortController` that aborts on disconnect. Any event type works — the object
is a proxy, so `on.click`, `on.input`, `on.submit`, `on.clicked` are all valid.

```js
import on from '@t2e1/kuba/event'

@on.input('input', value)
[change](newValue) {
  this.value = newValue
  return this
}
```

Read it as: *when an `input` event fires inside my shadow root on something
matching the selector `input`, pass the event through the `value` filter and
call this method with the result.*

Three details that matter:

- **The listener lives on `shadowRoot`, not on the host.** It only sees events
  originating inside the component. An event dispatched on the host itself
  won't trigger it.
- **The selector is matched against `event.target`.** It's delegation, so
  elements added by a later repaint are covered without rebinding.
- **Teardown is automatic.** The controller aborts on `disconnectedCallback`.

### Event filters

The arguments after the selector are filters, applied left to right, each
transforming the event before your method receives it:

| Filter | Turns the event into |
|---|---|
| `value` | `event.target.value` |
| `files` | `event.target.files` |
| `formData` | the form's data, parsed into a plain object |
| `dataset` | `event.target.dataset` |
| `detail` | `event.detail` |
| `prevent` | the event, after `preventDefault()` |
| `stop` | the event, after `stopPropagation()` |

They compose, which is how a single declaration expresses "intercept the native
submit, don't let it navigate, and hand me the parsed data":

```js
@on.submit('form', prevent, stop, formData)
[submitted](data) {
  this.dispatchEvent(customEvent('submitted', data))
  return this
}
```

## Middleware: `@before`, `@after`, `@around`

These wrap a method or setter with another method on the same class. They exist
so a component can separate *what* a setter stores from *what else* must happen
when it changes.

```js
@attributeChanged('hidden', booleanAttribute)
@around(hideable)
@before(cleanup)
set hidden(value) {
  this.#hidden = value
}
```

- **`@before(method)`** runs `method` first, synchronously, and its return value
  is passed into the original — use it to normalize input.
- **`@after(method)`** runs `method` with the original's result.
- **`@around(method)`** schedules `method` on a later tick via `setImmediate`,
  **discards its result**, and returns the original's value unchanged.

!> `@around` does not wrap the call the way the name suggests. It doesn't run
before *and* after, and it can't modify the return value — it's "and also do
this, soon". Reach for it when a state change has a side effect that shouldn't
block the setter, like reflecting a custom state.

## Dispatching: `@dispatchEvent`

Re-dispatches a method's return value (or a setter's new value) as a bubbling
`CustomEvent`, once the host is connected — so a property becomes observable
through Echo without writing `dispatchEvent` by hand:

```js
import { dispatchEvent } from '@t2e1/kuba/echo'

@dispatchEvent('clicked')
click() {
  return this.value
}
```

## Writing your own

A decorator here is just a function that receives the descriptor and replaces
the wrapped function. This one logs every call to the method it decorates:

```js
const logged = (label) => (_target, _key, descriptor) => {
  const original = descriptor.value

  descriptor.value = function (...args) {
    console.log(label, args)
    return original.apply(this, args)
  }
}
```

If you're hooking a native lifecycle callback rather than a method, use the
`execute` helper instead of overwriting the callback — it chains, so several
decorators can hook the same one:

```js
import execute from '@t2e1/kuba/directive'

const ready = (target, method) =>
  execute(method).on(target).after('connectedCallback')
```

That's exactly how `@connected`, `@disconnected`, `@adopted` and the form
callbacks are implemented — each is two lines over `execute`.

## A complete element

Putting the groups together: an element that renders a counter, reacts to a
click inside its shadow root, and publishes the new value as an event.

```js
import { connected, define } from '@t2e1/kuba/directive'
import attributeChanged from '@t2e1/kuba/directive/attributeChanged'
import { paint, repaint } from '@t2e1/kuba/dom'
import Echo, { dispatchEvent } from '@t2e1/kuba/echo'
import on from '@t2e1/kuba/event'
import { html, css } from '@t2e1/kuba/dom'

const component = (counter) => html`<button>${counter.count}</button>`
const style = () => css`:host { display: inline-block; }`

@define('my-counter')
@paint(component, style)
class Counter extends Echo(HTMLElement) {
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

  @on.click('button')
  @dispatchEvent('counted')
  increment() {
    this.count = this.count + 1
    return this.count
  }
}
```

Because it extends `Echo(HTMLElement)`, another element can now react to it from
markup alone: `on="my-counter/counted:setter/textContent"`.

## Next

- **[Components](/components/)** — the elements built with these decorators.
- **[Reference › Packages](/build-elements/)** — every export, by package.
