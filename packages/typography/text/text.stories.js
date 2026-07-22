export default {
  title: 'Typography/Text',
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'todo' },
  },
  render: ({ align, color, family, lineHeight, size, weight, content }) =>
    `<kb-text align="${align}" color="${color}" family="${family}" line-height="${lineHeight}" size="${size}" weight="${weight}">${content}</kb-text>`,
  argTypes: {
    align: {
      control: { type: 'select' },
      options: ['left', 'center', 'right', 'justify'],
      description: 'Text alignment. Reflects the `align` attribute.',
    },
    color: {
      control: 'text',
      description:
        'Text color keyword, mapped to the `--color-{value}` custom property. Reflects the `color` attribute.',
    },
    family: {
      control: 'text',
      description:
        'Font family keyword, mapped to the `--font-family-{value}` custom property. Reflects the `family` attribute.',
    },
    lineHeight: {
      control: 'text',
      description:
        'Line height keyword, mapped to the `--line-height-{value}` custom property. Reflects the `line-height` attribute.',
    },
    size: {
      control: 'text',
      description:
        'Font size keyword, mapped to the `--font-size-{value}` custom property. Reflects the `size` attribute.',
    },
    weight: {
      control: 'text',
      description:
        'Font weight keyword, mapped to the `--font-weight-{value}` custom property. Reflects the `weight` attribute.',
    },
    content: {
      control: 'text',
    },
  },
  args: {
    align: 'left',
    color: 'master-dark',
    family: 'base',
    lineHeight: 'lg',
    size: 'xxs',
    weight: 'regular',
    content: 'Hello world',
  },
}

export const Default = {}

export const Centered = {
  args: { align: 'center' },
}

export const Emphasized = {
  args: { size: 'md', weight: 'medium' },
}
