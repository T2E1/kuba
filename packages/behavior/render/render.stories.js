export default {
  title: 'Behavior/Render',
  parameters: {
    a11y: { test: 'todo' },
  },
  argTypes: {
    layout: {
      control: { type: 'select' },
      options: ['list', 'grid'],
      description:
        "`'list'` stacks slotted content in a single flex column, `'grid'` arranges it in a two-column grid.",
      table: { defaultValue: { summary: 'list' } },
    },
    template: {
      control: 'text',
      description:
        'Id reference to a `<template>` element elsewhere in the document, resolved once and cached. When left unset, the element looks for its own `<template>` child instead.',
      table: { defaultValue: { summary: '' } },
    },
    on: {
      control: 'text',
      description:
        "Arc string wiring an event from another element to this host, in the form `source/event:type/sink` (optionally `|filter=value`). Inherited from the `Echo` mixin — commonly used to wire a data source's `change` event to `render()`.",
    },
  },
  args: {
    layout: 'list',
    template: '',
    on: '',
  },
}

// `render()` only takes effect once the host has completed its initial
// paint (guarded by `@repaint`'s `isPainted` check) — calling it on a node
// that isn't connected to the DOM yet is a silent no-op. `play` runs after
// Storybook has mounted the story's markup into the canvas, so this is the
// only place seeding data actually works.
const renderSeededTemplate = ({ layout }) =>
  `<kb-render layout="${layout}"><template>{name} — {age}</template></kb-render>`

const seedTwoRecords = async ({ canvasElement }) => {
  canvasElement.querySelector('kb-render').render([
    { name: 'Ada Lovelace', age: 36 },
    { name: 'Alan Turing', age: 41 },
  ])
}

export const List = {
  render: renderSeededTemplate,
  play: seedTwoRecords,
}

export const Grid = {
  render: renderSeededTemplate,
  args: { layout: 'grid' },
  play: seedTwoRecords,
}

export const WiredToADataset = {
  render: () => `
    <k-dataset name="users" upsert="id"></k-dataset>
    <kb-render layout="grid">
      <template>{name} ({age})</template>
      <kb-on value="users/change:method/render"></kb-on>
    </kb-render>
    <p>
      <code>k-dataset</code> is the publisher: every
      <code>push()</code> dispatches <code>change</code> with the full
      record list as payload. <code>kb-render</code> subscribes via
      <code>kb-on</code> and re-renders its template — one
      interpolation per array entry — with zero manual DOM updates. The
      records below were added by calling <code>push()</code> on the
      dataset once this story mounted; <code>kb-render</code> never
      received them directly.
    </p>
  `,
  play: async ({ canvasElement }) => {
    canvasElement.querySelector('k-dataset').push([
      { id: 1, name: 'Grace Hopper', age: 85 },
      { id: 2, name: 'Margaret Hamilton', age: 87 },
    ])
  },
}
