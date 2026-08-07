# spark

```js
import spark, { equals, gt, len, not, prop, truthy } from '@t2e1/kuba/spark'
```

The operator registry behind [Echo](/reference/echo) arc filters. Each operator
is a pure function of `(data, value)` that transforms a payload on its way from
a publisher to a sink.

```html
<kb-text on="user/changed:setter/textContent|prop=email"></kb-text>
```

## The registry

| Name | `(data, value)` returns |
|---|---|
| `prop` | `data[value]` — the named property of the payload |
| `equals` | whether `data` equals `value` |
| `different` | whether `data` differs from `value` |
| `not` | the negation of `data` |
| `truthy` | whether `data` is truthy |
| `len` | the length of `data` |
| `add` / `subtract` | `data` plus / minus `value` |
| `inc` / `dec` | `data` incremented / decremented |
| `gt` / `gte` | whether `data` is greater than / at least `value` |
| `lt` / `lte` | whether `data` is less than / at most `value` |
| `always` | `value`, ignoring `data` |

Each is also importable directly, for use outside an arc.

## `spark.get(name)`

Resolves an operator by name.

!> **An unknown name resolves to the identity function**, not an error. That's
what makes a typo in an arc filter silent: the payload passes through untouched
and nothing reports it.

## `spark.set(name, fn)`

Registers an operator, or replaces one. Returns `spark`, so registrations chain.

```js
import spark from '@t2e1/kuba/spark'

spark
  .set('uppercase', (value) => String(value).toUpperCase())
  .set('slice', (value, size) => String(value).slice(0, Number(size)))
```

```html
<kb-text on="user/changed:setter/textContent|prop=name|uppercase"></kb-text>
```

Register before the arcs that use it connect — an element upgrading earlier
resolves the name to identity and keeps that resolution for that arc.

## What can't be an operator

Operators are **synchronous transforms of a value**. They receive a payload and
return a payload; they can't defer, drop or batch the sink call.

That rules out a whole category people reach for first:

- **`debounce` / `throttle`** — would need to delay the call. Throttle inside
  the sink method instead.
- **Anything async** — a promise would be passed along as the payload.
- **Conditional routing** — an operator can return `false`, but the sink is
  still invoked with it. There is no "don't call".
