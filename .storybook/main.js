import remarkGfm from 'remark-gfm'
import aliases from '../vite.aliases.js'

/** @type {import('@storybook/web-components-vite').StorybookConfig} */
const config = {
  stories: [
    '../stories/**/*.mdx',
    '../packages/**/*.mdx',
    '../packages/**/*.stories.js',
  ],
  framework: '@storybook/web-components-vite',
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  // MDX3 (used by addon-docs) doesn't parse GFM tables by default — without
  // this, every `|...|` table in stories/**/*.mdx renders as plain text.
  // Read via the "options" preset (addon-docs' mdxPlugin resolves
  // `presets.apply("options", {})?.mdxPluginOptions`), not a top-level key.
  options: {
    mdxPluginOptions: {
      mdxCompileOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  },
  viteFinal: async (viteConfig) => ({
    ...viteConfig,
    resolve: {
      ...viteConfig.resolve,
      alias: { ...viteConfig.resolve?.alias, ...aliases },
    },
  }),
}

export default config
