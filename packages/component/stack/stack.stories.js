export default {
  title: 'Components/Stack',
  tags: ['autodocs'],
  render: ({ direction, align, justify, spacing, content }) =>
    `<kb-stack direction="${direction}" align="${align}" justify="${justify}" spacing="${spacing}">${content}</kb-stack>`,
  argTypes: {
    direction: {
      control: { type: 'select' },
      options: ['row', 'column'],
      description: 'CSS `flex-direction` value applied to the host.',
    },
    align: {
      control: 'text',
      description: 'CSS `align-items` value applied to the host.',
    },
    justify: {
      control: 'text',
      description: 'CSS `justify-content` value applied to the host.',
    },
    spacing: {
      control: 'text',
      description:
        'Gap between children, resolved against the `--spacing_inset-{value}` CSS custom property.',
    },
    content: { control: 'text' },
  },
  args: {
    direction: 'row',
    align: 'start',
    justify: 'flex-start',
    spacing: 'xs',
    content: '<kb-button>A</kb-button><kb-button>B</kb-button>',
  },
  parameters: {
    a11y: { test: 'todo' },
  },
}

export const Row = {}

export const Column = {
  args: { direction: 'column' },
}

export const SpaceBetween = {
  args: { justify: 'space-between' },
}
