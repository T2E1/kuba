import aliases from '../vite.aliases.js'

/** @type {import('@storybook/web-components-vite').StorybookConfig} */
const config = {
  stories: ['../stories/**/*.mdx', '../packages/**/*.stories.js'],
  framework: '@storybook/web-components-vite',
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  viteFinal: async (viteConfig) => ({
    ...viteConfig,
    resolve: {
      ...viteConfig.resolve,
      alias: { ...viteConfig.resolve?.alias, ...aliases },
    },
  }),
}

export default config
