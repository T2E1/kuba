export default {
  title: 'Form/Form',
  tags: ['autodocs'],
  parameters: {
    actions: { handles: ['submitted', 'resetted'] },
    a11y: { test: 'todo' },
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
