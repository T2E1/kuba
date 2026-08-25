# Filter

Narrows the record collection of its **parent** by comparing each record's `key`
field against `value`, and publishes the matches. It renders nothing, and — this
is the part that surprises everyone — it dispatches the result **on the parent**,
not on itself.

```html preview
<kb-dataset id="stock-demo" name="stock" upsert="id">
  <kb-filter key="available" value="true"></kb-filter>
</kb-dataset>

<kb-render>
  <kb-on value="stock/filtered:method/render"></kb-on>
  <template>
    <kb-text size="xxs">{name} — available</kb-text>
  </template>
</kb-render>

<script type="module">
  const dataset = document.querySelector('#stock-demo')
  requestAnimationFrame(() => {
    dataset.push([
      { id: 1, name: 'Akita', available: 'true' },
      { id: 2, name: 'Corgi', available: 'false' },
      { id: 3, name: 'Beagle', available: 'true' },
    ])
    document.querySelector('kb-filter').value = 'true'
  })
</script>
```

## Usage

```html
<kb-dataset name="users" upsert="id">
  <kb-filter key="active" value="true"></kb-filter>
</kb-dataset>
```

```js
document.querySelector('kb-dataset').addEventListener('filtered', (event) => {
  render(event.detail) // the matching records
})
```

## When to use

- **Showing a subset of a collection** — active users, available items, one
  category — driven by an attribute rather than by script.
- **Re-filtering from another element's event**, by wiring an arc to this
  element's `value`.

## When not to use

- **Complex predicates.** The comparison is a strict `===` between the record's
  `key` field and `value`. There is no range, no substring, no case-insensitive
  match, no multi-field logic. Filter in your own code and push the result into
  a second `<kb-dataset>` when the rule is more than equality.
- **Filtering something that isn't a parent collection.** It reads
  `parentElement.value`; with no such parent it does nothing.

## The parent inversion

Every other element in the library dispatches its events on itself. This one
doesn't:

```html
<kb-dataset name="stock" upsert="id">
  <kb-filter key="available" value="true"></kb-filter>
</kb-dataset>

<!-- The arc's source is the DATASET, not the filter -->
<kb-render>
  <kb-on value="stock/filtered:method/render"></kb-on>
</kb-render>
```

!> **Wiring an arc to the filter's own `name` never fires.** The `filtered`
event is dispatched on `parentElement`, so the `source` segment must match the
parent — its `name`, its `#id`, or its tag name (`kb-dataset`). This is the
single most likely reason a filter "does nothing".

The same applies to `<kb-find>`. It's the one place where the library's "an
element publishes its own events" rule doesn't hold.

## Composition

- **Can contain**: nothing. It renders no shadow DOM.
- **Can be a child of**: an element exposing a `value` array — in practice
  `<kb-dataset>`. It waits for the parent to upgrade before reading it, so
  declaring it before the parent is defined is safe.

Several filters under the same parent each publish their own `filtered` event on
that parent, independently — they don't compose into an AND. Two filters means
two events with two different result sets, and whichever fired last wins at the
consumer.

## When it re-evaluates

Filtering runs when **`value` changes** — that's the only trigger. Two
consequences:

- **Setting the attribute is what fires it**, so a filter with a static `value`
  evaluates once, at upgrade, against whatever the parent held at that moment.
- **A later `push` on the parent does not re-filter.** The dataset dispatches
  `changed`, not `filtered`. If the collection grows after the fact, re-assign
  the filter's `value` to force a new pass, or wire the consumer to the parent's
  `changed` instead.

## Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `key` | `string` | — | Record field to compare. |
| `value` | `string` | — | Value it must equal. Assigning it triggers a new pass. |
| `on` | arc string | — | Echo wiring, `source/event:type/sink`. |

## Events

| Event | Dispatched on | `detail` |
|---|---|---|
| `filtered` | **the parent element** | an array of the matching records |

An empty result publishes an empty array, not nothing — the consumer still fires
and can show an empty state.

## States and accessibility

- Headless: no rendered output, no accessibility surface.
- Filtering changes what's on screen without moving focus or announcing
  anything. When a filter is user-driven, give the results region an
  `aria-live` value so the change is perceivable.

## Do's and don'ts

| Do | Don't |
|---|---|
| Point the arc's `source` at the **parent** | Use the filter's own `name` as the source — it never dispatches on itself |
| Use it for a single equality check | Expect ranges, substrings or multi-field logic |
| Re-assign `value` to re-evaluate after the data changes | Assume a later `push` re-filters automatically |
| Wire the consumer to `changed` when the collection is what matters | Stack two filters expecting them to combine |
