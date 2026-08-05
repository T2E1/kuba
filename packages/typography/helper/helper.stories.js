export default {
  title: 'Typography/Helper',
  // Docs page is authored by hand in helper.mdx (usage guidance), which
  // attaches via `<Meta of={HelperStories} />` — tagging this file 'autodocs'
  // too would generate a second, conflicting page.
  parameters: {
    a11y: { test: 'todo' },
    // Show the exact markup `render` returns (with args resolved) in the
    // "Show code" block, instead of Storybook's beautifier re-indenting it.
    docs: { source: { format: false } },
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
