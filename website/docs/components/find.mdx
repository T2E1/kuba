# Find

Selects the **first** record of its parent's collection whose `key` field equals
`value`, and publishes it. Like `<kb-filter>`, it renders nothing and dispatches
the result **on the parent**, not on itself — the difference is that it returns
one record instead of an array.

```html preview
<kb-dataset id="detail-demo" name="breeds" upsert="id">
  <kb-find key="id" value="2"></kb-find>
</kb-dataset>

<kb-render>
  <kb-on value="breeds/found:method/render"></kb-on>
  <template>
    <kb-card>
      <kb-text size="xs" weight="bold">{name}</kb-text>
      <kb-text size="xxxs" color="master">{temperament}</kb-text>
    </kb-card>
  </template>
</kb-render>

<script type="module">
  const dataset = document.querySelector('#detail-demo')
  requestAnimationFrame(() => {
    dataset.push([
      { id: '1', name: 'Akita', temperament: 'Docile, courageous' },
      { id: '2', name: 'Corgi', temperament: 'Tenacious, playful' },
    ])
    document.querySelector('kb-find').value = '2'
  })
</script>
```

## Usage

```html
<kb-dataset name="users" upsert="id">
  <kb-find key="id" value="1"></kb-find>
</kb-dataset>
```

```js
document.querySelector('kb-dataset').addEventListener('found', (event) => {
  showDetail(event.detail) // one record, or undefined
})
```

## When to use

- **A detail view driven by a selection** — a list publishes the clicked id, an
  arc assigns it to this element's `value`, and the matching record reaches the
  detail renderer.
- **Reading one record out of a collection you already hold**, without a second
  request.

## When not to use

- **Several matches.** This returns the first one only. Use `<kb-filter>` when
  more than one record can match, even if you expect one.
- **A predicate beyond equality.** The comparison is a strict `===` between the
  record's `key` field and `value`.
- **Fetching a record you don't have.** This searches memory; it makes no
  request. Pair it with `<kb-fetch>` when the record might not be loaded.

## The parent inversion

Same as `<kb-filter>`: the `found` event is dispatched on `parentElement`, so an
arc must name the **parent** as its source.

```html
<kb-dataset name="breeds" upsert="id">
  <kb-find key="id" value="2"></kb-find>
</kb-dataset>

<!-- source is the dataset, not the find -->
<kb-render>
  <kb-on value="breeds/found:method/render"></kb-on>
</kb-render>
```

!> An arc pointing at the find element's own `name` never fires. This is the
most likely reason a detail view stays empty.

## Composition

- **Can contain**: nothing.
- **Can be a child of**: an element exposing a `value` array — in practice
  `<kb-dataset>`. It waits for the parent to upgrade before reading it.

## Driving it from a selection

The pattern this element exists for — a list of cards, each publishing its own
id, feeding a detail view:

```html
<kb-dataset name="breeds" upsert="id">
  <kb-find key="id" value=""></kb-find>
</kb-dataset>

<kb-render>
  <kb-on value="breeds/changed:method/render"></kb-on>
  <template>
    <kb-card value="{id}"><kb-text size="xxs">{name}</kb-text></kb-card>
  </template>
</kb-render>

<kb-render>
  <kb-on value="breeds/found:method/render"></kb-on>
  <template><kb-text size="sm">{name}</kb-text></template>
</kb-render>
```

The card's `clicked` payload has to reach the find element's `value` — wire it
with an arc on the find itself: `on="kb-card/clicked:setter/value"`.

## When it re-evaluates

The search runs when **`value` changes**, and only then. A record pushed to the
parent afterwards doesn't re-trigger it; re-assign `value` to force a new pass.
Assigning the *same* value twice doesn't necessarily re-fire either, since the
setter runs on attribute change.

## Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `key` | `string` | — | Record field to compare. |
| `value` | `string` | — | Value it must equal. Assigning it triggers a new pass. |
| `on` | arc string | — | Echo wiring, `source/event:type/sink`. |

## Events

| Event | Dispatched on | `detail` |
|---|---|---|
| `found` | **the parent element** | the first matching record, or `undefined` |

!> **No match dispatches `undefined`, not an empty object.** A consumer that
interpolates it — `<kb-render>`, for instance — renders placeholders against
nothing rather than showing an empty state. Guard for it when a miss is
possible.

## States and accessibility

- Headless: no rendered output, no accessibility surface.
- A detail region that changes without moving focus leaves screen reader users
  unaware. When the selection is user-driven, move focus to the detail region or
  give it an `aria-live` value.

## Do's and don'ts

| Do | Don't |
|---|---|
| Point the arc's `source` at the **parent** | Use the find element's own `name` as the source |
| Use `<kb-filter>` when several records can match | Rely on `find` and silently drop the rest |
| Handle the `undefined` case for a miss | Assume a record always comes back |
| Re-assign `value` to re-evaluate after new data arrives | Expect a later `push` to re-run the search |
