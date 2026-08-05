export default {
  title: 'Typography/Label',
  // Docs page is authored by hand in label.mdx (usage guidance), which
  // attaches via `<Meta of={LabelStories} />` — tagging this file 'autodocs'
  // too would generate a second, conflicting page.
  parameters: {
    a11y: { test: 'todo' },
    // Show the exact markup `render` returns (with args resolved) in the
    // "Show code" block, instead of Storybook's beautifier re-indenting it.
    docs: { source: { format: false } },
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
