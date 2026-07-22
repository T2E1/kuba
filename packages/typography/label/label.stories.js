export default {
  title: 'Typography/Label',
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'todo' },
  },
  render: ({ content }) => `<kb-label>${content}</kb-label>`,
  argTypes: {
    content: {
      control: 'text',
    },
  },
  args: {
    content: 'Full name',
  },
}

export const Default = {}
