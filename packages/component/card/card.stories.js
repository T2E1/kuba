export default {
  title: 'Components/Card',
  tags: ['autodocs'],
  render: ({ direction, value, content }) =>
    `<kb-card direction="${direction}" value="${value}">${content}</kb-card>`,
  argTypes: {
    direction: {
      control: { type: 'select' },
      options: ['row', 'column'],
      description: "Flex layout direction for the card's content.",
    },
    value: {
      control: 'text',
      description:
        'Arbitrary payload sent as the detail of the `clicked` event.',
    },
    content: { control: 'text' },
  },
  args: {
    direction: 'column',
    value: '42',
    content: 'Card content',
  },
}

export const Column = {}

export const Row = {
  args: { direction: 'row' },
}
