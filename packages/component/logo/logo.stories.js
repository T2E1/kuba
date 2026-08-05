export default {
  title: 'Components/Logo',
  // Docs page is authored by hand in logo.mdx (usage guidance), which
  // attaches via `<Meta of={LogoStories} />` — tagging this file 'autodocs'
  // too would generate a second, conflicting page.
  parameters: {
    a11y: { test: 'todo' },
    // Show the exact markup `render` returns (with args resolved) in the
    // "Show code" block, instead of Storybook's beautifier re-indenting it.
    docs: { source: { format: false } },
  },
  render: () => `<kb-logo></kb-logo>`,
  argTypes: {},
  args: {},
}

export const Default = {}
