export default {
  title: 'Form/Fileupload',
  tags: ['autodocs'],
  parameters: {
    actions: { handles: ['change'] },
    a11y: { test: 'todo' },
  },
  render: ({ name, required, file, label, helper }) => `
    <kb-fileupload
      name="${name}"
      file="${file}"
      ${required ? 'required' : ''}
    >
      <span slot="label">${label}</span>
      <span slot="helper">${helper}</span>
    </kb-fileupload>
  `,
  argTypes: {
    name: {
      control: 'text',
      description:
        "The field name used when this element's value is included in the owning form's `FormData`.",
    },
    required: {
      control: 'boolean',
      description:
        'Whether a file must be selected for the element to be valid.',
    },
    file: {
      control: 'text',
      description:
        'The selected file encoded as a base64 data URL. Setting this value updates the preview, re-runs validation, and dispatches a `change` event.',
    },
    label: { control: 'text' },
    helper: { control: 'text' },
  },
  args: {
    name: 'avatar',
    required: false,
    file: '',
    label: 'Upload a photo',
    helper: 'PNG or JPG, up to 5MB',
  },
}

export const Default = {}

export const Required = {
  args: { required: true, label: 'Upload a photo (required)' },
}
