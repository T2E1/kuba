export default {
  title: 'Layout/Main',
  // Docs page is authored by hand in main.mdx (usage guidance), which
  // attaches via `<Meta of={MainStories} />` — tagging this file 'autodocs'
  // too would generate a second, conflicting page.
  parameters: {
    a11y: { test: 'todo' },
    // Show the exact markup `render` returns (with args resolved) in the
    // "Show code" block, instead of Storybook's beautifier re-indenting it.
    docs: { source: { format: false } },
  },
  render: ({ content }) => `<kb-main>${content}</kb-main>`,
  argTypes: {
    content: {
      control: 'text',
    },
  },
  args: {
    content: '<h1>Page title</h1><p>Page content.</p>',
  },
}

export const Default = {}
