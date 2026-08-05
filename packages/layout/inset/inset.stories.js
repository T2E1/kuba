export default {
  title: 'Layout/Inset',
  // Docs page is authored by hand in inset.mdx (usage guidance), which
  // attaches via `<Meta of={InsetStories} />` — tagging this file 'autodocs'
  // too would generate a second, conflicting page.
  parameters: {
    a11y: { test: 'todo' },
    // Show the exact markup `render` returns (with args resolved) in the
    // "Show code" block, instead of Storybook's beautifier re-indenting it.
    docs: { source: { format: false } },
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
