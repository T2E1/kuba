export default {
  title: 'Typography/Helper',
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'todo' },
  },
  render: ({ content }) => `<kb-helper>${content}</kb-helper>`,
  argTypes: {
    content: {
      control: 'text',
    },
  },
  args: {
    content: 'Must be at least 8 characters.',
  },
}

export const Hint = {}

export const ErrorMessage = {
  args: { content: 'This field is required.' },
}
