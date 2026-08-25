# Dataset

An in-memory collection of records, keyed by the field named in `upsert`, that
publishes `changed` whenever it's mutated. It renders nothing — it's the state
other elements react to.

```html preview
<kb-dataset id="people-demo" name="people" upsert="id"></kb-dataset>

<kb-render>
  <kb-on value="people/changed:method/render"></kb-on>
  <template>
    <kb-card>
      <kb-text size="xxs" weight="bold">{name}</kb-text>
      <kb-text size="xxxs" color="master">{role}</kb-text>
    </kb-card>
  </template>
</kb-render>

<script type="module">
  const dataset = document.querySelector('#people-demo')
  requestAnimationFrame(() =>
    dataset.push([
      { id: 1, name: 'Ada Lovelace', role: 'Mathematician' },
      { id: 2, name: 'Grace Hopper', role: 'Rear Admiral' },
    ]),
  )
</script>
```

## Usage

```html
<kb-dataset name="users" upsert="id"></kb-dataset>
```

```js
const dataset = document.querySelector('kb-dataset')
dataset.addEventListener('changed', (event) => render(event.detail))
dataset.push({ id: 1, name: 'Ada' })
```

## When to use

- **Holding a list the page renders from** — search results, a table, a cart —
  where several elements should react to the same collection.
- **Merging partial updates into existing records** — a websocket patch, a
  response that returns only changed fields — without losing what was stored.

## When not to use

- **Persistence.** This is memory only: a reload empties it. Pair it with
  `<kb-fetch>` or `localStorage` if the data must survive.
- **A single value.** For one record, or a scalar, an attribute on the consuming
  element is simpler.
- **Large collections.** Every mutation dispatches the *entire* collection as the
  event detail, and consumers re-render from scratch.

## Composition

- **Can contain**: `<kb-filter>` and `<kb-find>` children, which read this
  element's `value` and publish narrowed results **on this element**; plus
  `<kb-on>` for arcs. Nothing renders.
- **Can be a child of**: anything.

```html
<kb-dataset name="users" upsert="id">
  <kb-filter key="active" value="true"></kb-filter>
</kb-dataset>
```

## The upsert key

`upsert` names the field that identifies a record. It's what makes `push` a
merge rather than an append:

- A record whose key **matches** an existing one is **merged** into it —
  `Object.assign`, so fields absent from the new record keep their stored value.
  That's what makes partial updates safe.
- A record with **no value** for that key gets a generated uuid, so it's always
  inserted as new.
- The key is written back onto the stored record, so every entry carries its own
  identifier even when it arrived without one.

```js
dataset.push({ id: 1, name: 'Ada', role: 'Mathematician' })
dataset.push({ id: 1, role: 'Countess' })
// → [{ id: 1, name: 'Ada', role: 'Countess' }]  — name survived
```

!> With `upsert` unset, every record's key is `undefined`, so they all collide
into a single merged entry. Set it whenever records have any identity at all.

## Methods

| Method | Returns | Description |
|---|---|---|
| `push(data)` | `this` | Inserts or merges one record or an array of records. |
| `delete(key)` | `this` | Removes the record whose upsert-key value matches `key`. |
| `reset()` | `this` | Clears every stored record. |

All three dispatch `changed` afterwards, on a later tick — the mutation completes
synchronously, the event follows.

## Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `upsert` | `string` | — | Field name used as the record key when merging. |
| `name` | `string` | — | Identifies this element as the `source` of an arc. |
| `on` | arc string | — | Echo wiring, `source/event:type/sink`. |

## Properties

| Property | Type | Description |
|---|---|---|
| `value` | `unknown[]` | The current records, in insertion order. Read-only. |

## Events

| Event | Fires when | `detail` |
|---|---|---|
| `changed` | after `push`, `delete` or `reset` | the full collection, as an array |

The detail is always the **whole** collection, never a delta — consumers render
from the complete list every time, which is why `<kb-render>` needs no diffing.

## Wiring it to a fetch

The common pair: a request fills the dataset, and the dataset feeds the view.
Nothing imports anything.

```html
<kb-fetch name="api" url="/api/users">
  <kb-on value="load/clicked:method/get"></kb-on>
</kb-fetch>

<kb-dataset name="users" upsert="id">
  <kb-on value="api/succeeded:method/push"></kb-on>
</kb-dataset>

<kb-render>
  <kb-on value="users/changed:method/render"></kb-on>
  <template>{name}</template>
</kb-render>
```

## States and accessibility

- The element is headless and renders nothing — no accessibility surface of its
  own.
- A collection that changes without a visible cue is invisible to screen reader
  users. When records arrive asynchronously, give the region rendering them an
  `aria-live` value so the update is announced.

## Do's and don'ts

| Do | Don't |
|---|---|
| Set `upsert` to a real identifying field | Leave it unset and watch every record merge into one |
| Push partial records to patch stored ones | Push a full replacement when only one field changed |
| Keep collections small enough to re-render whole | Store thousands of rows and re-render on each mutation |
| Treat it as ephemeral state | Rely on it surviving a reload |
