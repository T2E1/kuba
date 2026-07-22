export default {
  title: 'Components/Cover',
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'todo' },
  },
  render: ({ src, alt, orientation }) =>
    `<kb-cover src="${src}" alt="${alt}" orientation="${orientation}"></kb-cover>`,
  argTypes: {
    src: {
      control: 'text',
      description: 'Image URL rendered by the underlying `<img>`.',
    },
    alt: {
      control: 'text',
      description: 'Alternative text for the underlying `<img>`.',
    },
    orientation: {
      control: { type: 'select' },
      options: ['landscape', 'portrait'],
      description:
        "Aspect ratio applied to the host: `'landscape'` renders 16/9, `'portrait'` renders 4/5.",
    },
  },
  args: {
    src: 'https://picsum.photos/800/450',
    alt: 'Product banner',
    orientation: 'landscape',
  },
}

export const Landscape = {}

export const Portrait = {
  args: { orientation: 'portrait', src: 'https://picsum.photos/450/560' },
}
