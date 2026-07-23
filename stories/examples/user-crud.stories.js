/**
 * A composed Guide, not a component catalog entry: a small user-management
 * screen built from five independent custom elements that never reference
 * each other directly — `<k-dataset>` (state, the source of truth),
 * `<kb-form>` (publishes `submitted`), `<kb-render>` (subscribes to
 * `change`, re-renders a list), and per-row `<kb-button>`s (publish
 * `clicked`, subscribed to by the dataset itself for delete). Every
 * connection is an `on`/`<kb-on>` arc — zero JavaScript event listeners
 * are written for this page. See Foundations/Dataflow for the underlying
 * publisher/subscriber model.
 */
export default {
  title: 'Guides/User CRUD',
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'todo' },
  },
}

export const AddAndDeleteRecords = {
  render: () => `
    <kb-card direction="column">
      <kb-form name="user-form" autorender>
        <template>
          <kb-stack direction="column">
            <kb-input name="name" required>
              <span slot="label">Name</span>
            </kb-input>
            <kb-input name="age" type="number" required>
              <span slot="label">Age</span>
            </kb-input>
            <kb-button>Add user</kb-button>
          </kb-stack>
        </template>
        <kb-on value="user-form/submitted:method/reset"></kb-on>
      </kb-form>
    </kb-card>

    <kb-render layout="list">
      <template>
        <kb-stack direction="row">
          <span>{name} — {age}</span>
          <kb-button name="delete" value="{id}" color="danger" variant="outline">
            Delete
          </kb-button>
        </kb-stack>
      </template>
      <kb-on value="users/change:method/render"></kb-on>
    </kb-render>

    <k-dataset name="users" upsert="id">
      <kb-on value="user-form/submitted:method/push"></kb-on>
      <kb-on value="delete/clicked:method/delete"></kb-on>
    </k-dataset>

    <p>
      <code>&lt;kb-form&gt;</code> publishes <code>submitted</code> with its
      parsed form data; <code>&lt;k-dataset&gt;</code>
      subscribes and calls <code>push()</code>, which publishes
      <code>change</code> in turn; <code>&lt;kb-render&gt;</code>
      subscribes to that and re-renders the list, including a
      <code>name="delete"</code> button per row whose <code>value</code>
      was interpolated to that row's <code>id</code>. The dataset also
      subscribes to <em>that</em> button's <code>clicked</code> event
      (matched by <code>name</code>, since every row's delete button
      shares the same name) to remove the record. Three elements, three
      arcs, no imperative wiring.
    </p>
  `,
  play: async ({ canvasElement }) => {
    canvasElement.querySelector('k-dataset').push([
      { id: 1, name: 'Ada Lovelace', age: 36 },
      { id: 2, name: 'Alan Turing', age: 41 },
    ])
  },
}
