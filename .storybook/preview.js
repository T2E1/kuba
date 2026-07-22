import '../packages/pixel/index.css'
import '../index.js'

/** @type {import('@storybook/web-components-vite').Preview} */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
      },
    },
  },
}

export default preview
