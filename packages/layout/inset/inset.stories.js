export default {
  title: 'Layout/Inset',
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'todo' },
  },
  render: ({ direction, side, content }) =>
    `<kb-inset direction="${direction}" side="${side}">${content}</kb-inset>`,
  argTypes: {
    direction: {
      control: { type: 'select' },
      options: ['row', 'column'],
      description:
        'Flex direction of the slotted content. Reflects the `direction` attribute.',
    },
    side: {
      control: 'text',
      description:
        'Which side(s) receive the negative margin/border-radius inset. Reflects the `side` attribute.',
    },
    content: {
      control: 'text',
    },
  },
  args: {
    direction: 'column',
    side: 'all',
    content:
      '<img src="https://picsum.photos/400/200" alt="" style="width: 100%; display: block;" />',
  },
}

export const Column = {}

export const Row = {
  args: { direction: 'row' },
}

export const BottomOnly = {
  args: { side: 'bottom' },
}
