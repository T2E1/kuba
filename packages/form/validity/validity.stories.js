export default {
  title: 'Form/Validity',
  // Docs page is authored by hand in validity.mdx (usage guidance), which
  // attaches via `<Meta of={ValidityStories} />` — tagging this file
  // 'autodocs' too would generate a second, conflicting page.
  parameters: {
    a11y: { test: 'todo' },
    // Show the exact markup `render` returns (with args resolved) in the
    // "Show code" block, instead of Storybook's beautifier re-indenting it.
    docs: { source: { format: false } },
  },
  render: ({ state, message }) => `
    <kb-input name="email" type="email" required>
      <span slot="label">Email</span>
      <kb-validity slot="validity" state="${state}">${message}</kb-validity>
    </kb-input>
  `,
  argTypes: {
    state: {
      control: 'text',
      description:
        "The name of the `ValidityState` key to watch on the parent element (e.g. `'valueMissing'`, `'patternMismatch'`, `'tooShort'`).",
    },
    message: { control: 'text' },
  },
  args: {
    state: 'valueMissing',
    message: 'This field is required.',
  },
}

export const Default = {}

export const TypeMismatch = {
  args: { state: 'typeMismatch', message: 'Enter a valid email address.' },
}
