export default {
  title: 'Form/Form',
  // Docs page is authored by hand in form.mdx (usage guidance), which
  // attaches via `<Meta of={FormStories} />` — tagging this file 'autodocs'
  // too would generate a second, conflicting page.
  parameters: {
    actions: { handles: ['submitted', 'resetted'] },
    a11y: { test: 'todo' },
    // Show the exact markup `render` returns (with args resolved) in the
    // "Show code" block, instead of Storybook's beautifier re-indenting it.
    docs: { source: { format: false } },
  },
  render: ({ autorender }) => `
    <kb-form ${autorender ? 'autorender' : ''}>
      <template>
        <kb-input name="email" type="email" required>
          <span slot="label">Email</span>
        </kb-input>
        <kb-button type="submit">Send</kb-button>
      </template>
    </kb-form>
  `,
  argTypes: {
    autorender: {
      control: 'boolean',
      description:
        'Whether the element should render its `<template>` content automatically as soon as it connects to the DOM, without waiting for an explicit `render()` call.',
    },
  },
  args: {
    autorender: true,
  },
}

export const Default = {}

export const Manual = {
  args: { autorender: false },
}
