export default {
  title: 'Form/Textarea',
  // Docs page is authored by hand in textarea.mdx (usage guidance), which
  // attaches via `<Meta of={TextareaStories} />` — tagging this file
  // 'autodocs' too would generate a second, conflicting page.
  parameters: {
    actions: { handles: ['changed'] },
    a11y: { test: 'todo' },
    // Show the exact markup `render` returns (with args resolved) in the
    // "Show code" block, instead of Storybook's beautifier re-indenting it.
    docs: { source: { format: false } },
  },
  render: ({
    name,
    placeholder,
    value,
    disabled,
    readonly,
    required,
    label,
  }) => `
    <kb-textarea
      name="${name}"
      placeholder="${placeholder}"
      value="${value}"
      ${disabled ? 'disabled' : ''}
      ${readonly ? 'readonly' : ''}
      ${required ? 'required' : ''}
    >
      <span slot="label">${label}</span>
    </kb-textarea>
  `,
  argTypes: {
    name: {
      control: 'text',
      description:
        "The field name used when this element's value is included in the owning form's `FormData`.",
    },
    placeholder: {
      control: 'text',
      description:
        'Placeholder text, forwarded to the inner native `<textarea>`.',
    },
    value: {
      control: 'text',
      description:
        'The current text value. Setting it updates the inner `<textarea>`, re-runs validation, and dispatches a `change` event.',
    },
    disabled: {
      control: 'boolean',
      description:
        'Whether the textarea is disabled and excluded from form submission.',
    },
    readonly: {
      control: 'boolean',
      description: 'Whether the value can be changed by the user.',
    },
    required: {
      control: 'boolean',
      description: 'Whether a value is required for the element to be valid.',
    },
    label: { control: 'text' },
  },
  args: {
    name: 'bio',
    placeholder: 'Tell us about yourself',
    value: '',
    disabled: false,
    readonly: false,
    required: false,
    label: 'Bio',
  },
}

export const Default = {}

export const Required = {
  args: { required: true, label: 'Bio (required)' },
}

export const Disabled = {
  args: { disabled: true, value: 'Software developer.' },
}
