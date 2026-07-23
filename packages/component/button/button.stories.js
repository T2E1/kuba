export default {
  title: 'Components/Button',
  tags: ['autodocs'],
  parameters: {
    actions: { handles: ['clicked'] },
    a11y: { test: 'todo' },
  },
  render: ({ color, variant, type, value, width, hidden, on, label }) =>
    `<kb-button color="${color}" variant="${variant}" type="${type}" value="${value}" width="${width}" ${hidden ? 'hidden' : ''} on="${on}">${label}</kb-button>`,
  argTypes: {
    color: {
      control: { type: 'select' },
      options: [
        'master',
        'primary',
        'complete',
        'success',
        'warning',
        'danger',
        'info',
        'menu',
      ],
      description:
        'Semantic color, resolved against the `--color-{value}` CSS custom property.',
    },
    variant: {
      control: { type: 'select' },
      options: ['solid', 'naked', 'ghost', 'link', 'icon'],
      description: 'Visual style, exposed to CSS as a custom element state.',
    },
    type: {
      control: { type: 'select' },
      options: ['submit', 'reset'],
      description: 'Native button behavior inside a `<form>`.',
    },
    value: {
      control: 'text',
      description:
        'Arbitrary payload carried by the button, returned by `click()`.',
    },
    width: {
      control: 'text',
      description:
        'Width of the button, normalized by the `resizing` filter: numeric `px`/`%` values pass through, `hug` becomes `auto`, `fill` becomes `100%`, anything else defaults to `auto`.',
    },
    hidden: {
      control: 'boolean',
      description:
        'Whether the button is hidden. `"false"`/`"0"`/absent read as `false`; any other attribute value reads as `true`.',
    },
    on: {
      control: 'text',
      description:
        'Arc string wiring an event from another element to this button, in the form `source/event:type/sink` (optionally `|filter=value`). Inherited from the `Echo` mixin.',
    },
    label: { control: 'text' },
  },
  args: {
    color: 'primary',
    variant: 'solid',
    type: 'submit',
    value: '',
    width: 'auto',
    hidden: false,
    on: '',
    label: 'Save',
  },
}

export const Primary = {}

export const Naked = {
  args: { variant: 'naked' },
}

export const Danger = {
  args: { color: 'danger', label: 'Delete' },
}
