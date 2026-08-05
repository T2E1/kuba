export default {
  title: 'Components/Progress',
  // Docs page is authored by hand in progress.mdx (usage guidance), which
  // attaches via `<Meta of={ProgressStories} />` — tagging this file
  // 'autodocs' too would generate a second, conflicting page.
  parameters: {
    a11y: { test: 'todo' },
    // Show the exact markup `render` returns (with args resolved) in the
    // "Show code" block, instead of Storybook's beautifier re-indenting it.
    docs: { source: { format: false } },
  },
  render: ({ value }) => `<kb-progress value="${value}"></kb-progress>`,
  argTypes: {
    value: {
      control: 'text',
      description: 'Fill percentage of the progress bar, `0`-`100`.',
    },
  },
  args: {
    value: '60',
  },
}

export const Default = {}

export const Empty = {
  args: { value: '0' },
}

export const Complete = {
  args: { value: '100' },
}
