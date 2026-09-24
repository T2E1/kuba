import { resolve } from 'node:path'
import { defineConfig } from 'vitepress'
import labels from './navigation/labels.js'
import nav from './navigation/nav.js'
import sidebar from './navigation/sidebar.js'
import previewPlugin from './plugins/preview.js'

// kuba é servido do CDN, pinado à versão publicada — a doc é um consumidor
// real do pacote. Bump a cada release.
// `pages-deploy.yml` lê a linha abaixo por grep antes de publicar o site, e
// falha se a versão não estiver no npm. Manter a forma exata: constante de
// topo, atribuição direta, literal entre aspas simples.
const KUBA_VERSION = '0.2.0-alpha.7'

const CDN = `https://cdn.jsdelivr.net/npm/@t2e1/kuba@${KUBA_VERSION}/dist`

// O site é servido de https://t2e1.github.io/kuba/. O VitePress resolve a base
// nos links e no logo, mas não no que é declarado em `head` — ali a base entra
// à mão.
const BASE = '/kuba/'

// Inglês na raiz; pt-br e es ganham prefixo de rota.
const ROOT_LOCALE = 'en'

const navigationFor = (locale: string) => {
  const prefix = locale === ROOT_LOCALE ? '' : `/${locale}`
  const label = labels[locale]
  return {
    nav: nav(prefix, label),
    sidebar: sidebar(prefix, label),
    outline: { label: label.outline },
  }
}

export default defineConfig({
  title: 'kuba',
  description: 'Lightweight Web Components primitives and custom elements',
  base: BASE,

  // `.vitepress/` mora em `website/`, então a raiz do projeto é `website/` e
  // todo caminho abaixo é relativo a ela: o conteúdo em `website/docs/`, os
  // assets estáticos em `website/docs/public/`.
  srcDir: 'docs',

  // `build` em vez do padrão `.vitepress/dist`: `pages-deploy.yml` publica
  // `website/build` e `docs-links.yml` varre `website/build/**/*.html`.
  outDir: 'build',

  // Herdado do `onBrokenLinks: 'throw'` do Docusaurus: um link interno morto
  // falha o build, não a leitura de quem chega pela primeira vez.
  ignoreDeadLinks: false,

  // URLs com `.html`, como as que o Docusaurus gerava: `docs-links.yml`
  // resolve cada link contra um arquivo real em `website/build`.
  cleanUrls: false,

  head: [
    ['link', { rel: 'icon', href: `${BASE}img/logo.svg` }],
    [
      'link',
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    ],
    [
      'link',
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
        crossorigin: 'anonymous',
      },
    ],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded',
      },
    ],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;500;700&family=Roboto:wght@400;500;700&display=swap',
      },
    ],
    ['link', { rel: 'stylesheet', href: `${CDN}/kuba.css` }],
    ['script', { type: 'module', src: `${CDN}/kuba.js` }],
  ],

  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: navigationFor('en'),
    },
    'pt-br': {
      label: 'Português (Brasil)',
      lang: 'pt-BR',
      themeConfig: navigationFor('pt-br'),
    },
    es: {
      label: 'Español',
      lang: 'es',
      themeConfig: navigationFor('es'),
    },
  },

  themeConfig: {
    logo: {
      light: '/img/logo.svg',
      dark: '/img/logo-dark.svg',
      alt: 'kuba logo',
    },
    search: {
      provider: 'local',
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/T2E1/kuba' }],
    editLink: {
      pattern: 'https://github.com/T2E1/kuba/edit/main/website/docs/:path',
    },
    footer: {
      copyright: `Copyright © ${new Date().getFullYear()} T2E1`,
    },
  },

  markdown: {
    config(md) {
      md.use(previewPlugin)
    },
  },

  vite: {
    resolve: {
      alias: {
        '@home': resolve(import.meta.dirname, 'theme/components/home'),
        '@page': resolve(import.meta.dirname, 'theme/components/page'),
      },
    },
  },
})
