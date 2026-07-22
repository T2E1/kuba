export default {
  title: 'Components/Footer',
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'todo' },
  },
  render: ({ trailing }) =>
    `<kb-footer><span slot="trailing">${trailing}</span></kb-footer>`,
  argTypes: {
    trailing: {
      control: 'text',
      description: 'Content projected into the `trailing` slot.',
    },
  },
  args: {
    trailing: 'Privacy Policy',
  },
}

export const Default = {}
