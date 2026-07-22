export default {
  title: 'Components/Button',
  tags: ['autodocs'],
  render: ({ color, variant, type, label }) =>
    `<kb-button color="${color}" variant="${variant}" type="${type}">${label}</kb-button>`,
  argTypes: {
    color: {
      control: 'text',
      description:
        'Semantic color, resolved against the `--color-{value}` CSS custom property.',
    },
    variant: {
      control: 'text',
      description: 'Visual style, exposed to CSS as a custom element state.',
    },
    type: {
      control: { type: 'select' },
      options: ['submit', 'reset'],
      description: 'Native button behavior inside a `<form>`.',
    },
    label: { control: 'text' },
  },
  args: {
    color: 'primary',
    variant: 'solid',
    type: 'submit',
    label: 'Save',
  },
}

export const Primary = {}

export const Outline = {
  args: { variant: 'outline' },
}

export const Danger = {
  args: { color: 'danger', label: 'Delete' },
}
