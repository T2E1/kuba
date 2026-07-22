export default {
  title: 'Components/Header',
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'todo' },
  },
  render: ({ trailing }) =>
    `<kb-header><nav slot="trailing">${trailing}</nav></kb-header>`,
  argTypes: {
    trailing: {
      control: 'text',
      description: 'Content projected into the `trailing` slot.',
    },
  },
  args: {
    trailing: 'Home',
  },
}

export const Default = {}
