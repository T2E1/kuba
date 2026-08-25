// @ts-check
import { themes as prismThemes } from 'prism-react-renderer'
import previewPlugin from './src/remark/preview-plugin.js'

// kuba é servido do CDN, pinado à versão publicada — a doc é um consumidor
// real do pacote. Bump a cada release.
const KUBA_VERSION = '0.2.0-alpha.4'

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'kuba',
  tagline: 'Lightweight Web Components primitives and custom elements',
  favicon: 'img/logo.svg',

  future: {
    v4: true,
  },

  url: 'https://t2e1.github.io',
  baseUrl: '/kuba/',

  organizationName: 'T2E1',
  projectName: 'kuba',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Inglês na raiz, pt-br e es como fallback quando uma página ainda não
  // foi traduzida.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt-br', 'es'],
    localeConfigs: {
      en: { label: 'English' },
      'pt-br': { label: 'Português (Brasil)' },
      es: { label: 'Español' },
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          // routeBasePath '/' preserva as URLs que _sidebar.md já usa
          // (/components/logo, /learn/introduction) sem prefixo /docs/.
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          remarkPlugins: [previewPlugin],
          editUrl: 'https://github.com/T2E1/kuba/tree/main/docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
        crossorigin: 'anonymous',
      },
    },
  ],

  stylesheets: [
    'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded',
    'https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;500;700&family=Roboto:wght@400;500;700&display=swap',
    `https://cdn.jsdelivr.net/npm/@t2e1/kuba@${KUBA_VERSION}/dist/kuba.css`,
  ],

  scripts: [
    {
      src: `https://cdn.jsdelivr.net/npm/@t2e1/kuba@${KUBA_VERSION}/dist/kuba.js`,
      type: 'module',
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'kuba',
        logo: {
          alt: 'kuba logo',
          src: 'img/logo.svg',
          srcDark: 'img/logo-dark.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            to: '/components/',
            position: 'left',
            label: 'Components',
          },
          { type: 'localeDropdown', position: 'right' },
          {
            href: 'https://github.com/T2E1/kuba',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              { label: 'Introduction', to: '/learn/introduction' },
              { label: 'Components', to: '/components' },
              { label: 'Build elements', to: '/build-elements' },
            ],
          },
          {
            title: 'Community',
            items: [
              { label: 'Contributing', to: '/contributing' },
              { label: 'GitHub', href: 'https://github.com/T2E1/kuba' },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} T2E1. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['bash', 'json'],
      },
    }),
}

export default config
