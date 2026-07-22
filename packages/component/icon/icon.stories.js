export default {
  title: 'Components/Icon',
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'todo' },
  },
  render: ({ use, size, color }) =>
    `<kb-icon use="${use}" size="${size}" color="${color}"></kb-icon>`,
  argTypes: {
    use: {
      control: 'text',
      description:
        'Material Symbols ligature name to render, e.g. `"home"` or `"search"`.',
    },
    size: {
      control: 'text',
      description:
        'Icon size keyword, resolved against the `--font-size-{value}` CSS custom property.',
    },
    color: {
      control: 'text',
      description:
        'Icon color, resolved against the `--color-{value}` CSS custom property. Falls back to `currentColor` when unset.',
    },
  },
  args: {
    use: 'home',
    size: 'md',
    color: '',
  },
}

export const Default = {}

export const Large = {
  args: { use: 'search', size: 'lg' },
}

export const Colored = {
  args: { use: 'favorite', color: 'primary' },
}
