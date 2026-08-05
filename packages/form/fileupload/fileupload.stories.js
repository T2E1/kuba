export default {
  title: 'Form/Fileupload',
  // Docs page is authored by hand in fileupload.mdx (usage guidance), which
  // attaches via `<Meta of={FileuploadStories} />` — tagging this file
  // 'autodocs' too would generate a second, conflicting page.
  parameters: {
    actions: { handles: ['change'] },
    a11y: { test: 'todo' },
    // Show the exact markup `render` returns (with args resolved) in the
    // "Show code" block, instead of Storybook's beautifier re-indenting it.
    docs: { source: { format: false } },
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
