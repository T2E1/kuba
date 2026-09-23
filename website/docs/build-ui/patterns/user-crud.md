# User CRUD

A small management screen — add records, list them, delete one — built from
four elements that never reference each other. Every connection is an arc.
**No page author writes a single event listener.**

```html preview
<kb-card direction="column">
  <kb-form name="crud-form" autorender>
    <template>
      <kb-stack direction="column" align="stretch">
        <kb-input name="name" required>
          <kb-label>Name</kb-label>
        </kb-input>
        <kb-input name="age" type="number" required>
          <kb-label>Age</kb-label>
        </kb-input>
        <kb-button type="submit">Add user</kb-button>
      </kb-stack>
    </template>
    <kb-on value="crud-form/submitted:method/reset"></kb-on>
  </kb-form>
</kb-card>

<kb-render layout="list">
  <kb-on value="crud-users/changed:method/render"></kb-on>
  <template>
    <kb-stack direction="row" justify="space-between" align="center">
      <kb-text size="xxs">{name} — {age}</kb-text>
      <kb-button name="crud-delete" value="{id}" color="danger" variant="naked">
        Delete
      </kb-button>
    </kb-stack>
  </template>
</kb-render>

<kb-dataset name="crud-users" upsert="id">
  <kb-on value="crud-form/submitted:method/push"></kb-on>
  <kb-on value="crud-delete/clicked:method/delete"></kb-on>
</kb-dataset>

<script type="module">
  requestAnimationFrame(() =>
    document.querySelector('kb-dataset[name="crud-users"]').push([
      { id: 1, name: 'Ada Lovelace', age: 36 },
      { id: 2, name: 'Alan Turing', age: 41 },
    ]),
  )
</script>
```

## The dataflow

Four arcs, and each one is a sentence:

| Arc | Reads as |
|---|---|
| `crud-form/submitted:method/push` | when the form is submitted, push its data into the dataset |
| `crud-form/submitted:method/reset` | …and reset the form |
| `crud-users/changed:method/render` | when the collection changes, re-render the list |
| `crud-delete/clicked:method/delete` | when a delete button is clicked, delete that record |

The cycle closes on itself: the form feeds the dataset, the dataset feeds the
list, and the list's buttons feed the dataset again. Nothing imports anything.

## How each piece works

### The form publishes parsed data

`<kb-form>` renders its fields from the `<template>` and publishes `submitted`
with the form's data already parsed into an object, keyed by each field's
`name`. Native validation runs first, so an empty required field blocks the
event entirely — there's no "is it valid" check anywhere in this page.

The second arc points the form at **itself**: `submitted` triggers its own
`reset()`, clearing the fields after a successful add.

### The dataset merges by key

`upsert="id"` makes `push()` a merge rather than an append. The submitted record
has no `id`, so the dataset generates a uuid and writes it back onto the stored
record — which is what makes `{id}` available to the template later.

### The list interpolates per record

`<kb-render>` renders its template once per record in the array, so `{name}`,
`{age}` and `{id}` resolve per row. The delete button's `value="{id}"` is the
key detail: **each row's button carries its own record id as its payload.**

### One arc serves every row's button

Every delete button shares `name="crud-delete"`, and the arc's `source` segment
matches by name — so a single arc covers all rows, present and future. The
button publishes `clicked` with its `value`, which is exactly the argument
`delete(key)` expects.

This is why buttons rendered *after* the arc was connected still work: arcs
subscribe to the shared bus by name, not to element references.

## Things worth knowing

### The bus is global, and matches by name

Echo's bus is shared across the whole page. An arc whose source is `users` fires
for **any** element on the page named `users` — including one in a different
component, a different example, or a different feature.

That's why every name in this recipe is prefixed (`crud-form`, `crud-users`,
`crud-delete`) rather than the more natural `form`, `users`, `delete`: this page
holds several live examples, and unprefixed names would cross-wire them. In a
real app, scope names to the feature for the same reason.

### It's memory only

`<kb-dataset>` holds records in memory. A reload empties it. To persist, add a
`<kb-fetch>` and one more arc:

```html
<kb-fetch name="api" url="/api/users">
  <kb-on value="crud-form/submitted:method/post"></kb-on>
</kb-fetch>

<kb-dataset name="crud-users" upsert="id">
  <kb-on value="api/succeeded:method/push"></kb-on>
</kb-dataset>
```

Now the form feeds the request, and the *response* feeds the dataset — so the
list shows what the server actually stored, including any id or field it
generated.

### Editing needs one more element

This recipe covers create, read and delete. Update is the same `push()` — since
it merges by key, pushing `{ id: 1, age: 37 }` patches that record without
touching `name`. What's missing is a way to load a record back into the form,
which is what [`<kb-find>`](/components/find) is for.

### Deleting is immediate

There's no confirmation step. `color="danger"` marks the action as destructive
visually, but nothing guards it. For anything harder to undo than this, put a
confirmation between the click and the delete — which means a listener, or a
dialog element that publishes its own confirmed event.

## Related

- [Events and Echo](/foundations/events-and-echo) — the arc grammar.
- [Dataset](/components/dataset) — the upsert key and its methods.
- [Form](/components/form) — template rendering and the submitted payload.
