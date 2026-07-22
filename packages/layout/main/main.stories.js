export default {
  title: 'Layout/Main',
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'todo' },
  },
  render: ({ content }) => `<kb-main>${content}</kb-main>`,
  argTypes: {
    content: {
      control: 'text',
    },
  },
  args: {
    content: '<h1>Page title</h1><p>Page content.</p>',
  },
}

export const Default = {}
