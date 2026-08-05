export default {
  title: 'Components/Header',
  // Docs page is authored by hand in header.mdx (usage guidance), which
  // attaches via `<Meta of={HeaderStories} />` — tagging this file 'autodocs'
  // too would generate a second, conflicting page.
  parameters: {
    a11y: { test: 'todo' },
    // Show the exact markup `render` returns (with args resolved) in the
    // "Show code" block, instead of Storybook's beautifier re-indenting it.
    docs: { source: { format: false } },
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
