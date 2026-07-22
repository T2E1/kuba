export default {
  title: 'Form/Input',
  tags: ['autodocs'],
  parameters: {
    actions: { handles: ['change'] },
    a11y: { test: 'todo' },
  },
  render: ({
    name,
    type,
    placeholder,
    value,
    disabled,
    readonly,
    required,
    label,
    helper,
  }) => `
    <kb-input
      name="${name}"
      type="${type}"
      placeholder="${placeholder}"
      value="${value}"
      ${disabled ? 'disabled' : ''}
      ${readonly ? 'readonly' : ''}
      ${required ? 'required' : ''}
    >
      <span slot="label">${label}</span>
      <span slot="helper">${helper}</span>
    </kb-input>
  `,
  argTypes: {
    name: {
      control: 'text',
      description:
        "The field name used when this element's value is included in the owning form's `FormData`.",
    },
    type: {
      control: 'text',
      description:
        'The input type (e.g. `text`, `email`, `number`), forwarded to the inner native `<input>`.',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text, forwarded to the inner native `<input>`.',
    },
    value: {
      control: 'text',
      description:
        'The current text value. Setting it updates the inner `<input>`, re-runs validation, and dispatches a `change` event.',
    },
    disabled: {
      control: 'boolean',
      description:
        'Whether the input is disabled and excluded from form submission.',
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
    helper: { control: 'text' },
  },
  args: {
    name: 'email',
    type: 'text',
    placeholder: 'you@example.com',
    value: '',
    disabled: false,
    readonly: false,
    required: false,
    label: 'Email',
    helper: "We'll never share it.",
  },
}

export const Default = {}

export const Required = {
  args: { required: true, label: 'Email (required)' },
}

export const Disabled = {
  args: { disabled: true, value: 'jane@example.com' },
}

export const Readonly = {
  args: { readonly: true, value: 'jane@example.com' },
}
