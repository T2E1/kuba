export default {
  title: 'Form/Validity',
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'todo' },
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
