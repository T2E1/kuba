export default {
  title: 'Components/Progress',
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'todo' },
  },
  render: ({ value }) => `<kb-progress value="${value}"></kb-progress>`,
  argTypes: {
    value: {
      control: 'text',
      description: 'Fill percentage of the progress bar, `0`-`100`.',
    },
  },
  args: {
    value: '60',
  },
}

export const Default = {}

export const Empty = {
  args: { value: '0' },
}

export const Complete = {
  args: { value: '100' },
}
