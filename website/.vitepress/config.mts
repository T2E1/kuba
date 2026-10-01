import { resolve } from 'node:path'
import { defineConfig } from 'vitepress'
import labels from './navigation/labels.js'
import nav from './navigation/nav.js'
import sidebar from './navigation/sidebar.js'
import previewPlugin from './plugins/preview.js'
import { createSeo, localeByKey, SITE_URL } from './plugins/seo/index.js'
import { trailTo } from './theme/components/trail.js'

// kuba é servido do CDN, pinado à versão publicada — a doc é um consumidor
// real do pacote. Bump a cada release.
// `pages-deploy.yml` lê a linha abaixo por grep antes de publicar o site, e
// falha se a versão não estiver no npm. Manter a forma exata: constante de
// topo, atribuição direta, literal entre aspas simples.
const KUBA_VERSION = '0.2.0-alpha.7'

const CDN = `https://cdn.jsdelivr.net/npm/@t2e1/kuba@${KUBA_VERSION}/dist`

// O site é servido de SITE_URL (`plugins/seo/site.js`), e a base é o caminho
// dela: trocar de domínio é trocar aquela constante. O VitePress resolve a
// base nos links e no logo, mas não no que é declarado em `head` — ali a base
// entra à mão.
const BASE = new URL(SITE_URL).pathname

// Inglês na raiz; pt-br e es ganham prefixo de rota.
const ROOT_LOCALE = 'en'

const navigationFor = (locale: string) => {
  const prefix = locale === ROOT_LOCALE ? '' : `/${locale}`
  const label = labels[locale]
  return {
    nav: nav(prefix, label),
    sidebar: sidebar(prefix, label),
    outline: { label: label.outline },
    // Rótulo do "última atualização" que o tema desenha no rodapé de cada
    // página de doc — sem ele, o tema escreve "Last updated" em todo idioma.
    lastUpdated: { text: label.lastUpdated },
  }
}

// `lang`, descrição e modelo de título vêm de `plugins/seo/locales.js`, a
// mesma tabela que gera o hreflang — `<html lang>` e `hreflang` não divergem.
const localeConfig = (locale: string, label: string) => {
  const seoLocale = localeByKey(locale)
  return {
    label,
    lang: seoLocale.lang,
    description: seoLocale.description,
    titleTemplate: seoLocale.titleTemplate,
    themeConfig: navigationFor(locale),
  }
}

// A trilha de migalhas do JSON-LD lê a mesma sidebar que `Breadcrumb.vue`.
const trailFor = (relativePath: string, locale: string) =>
  trailTo(navigationFor(locale).sidebar, relativePath) ?? []

const seo = createSeo({ version: KUBA_VERSION, trailFor })

export default defineConfig({
  title: 'kuba',
  description: localeByKey(ROOT_LOCALE).description,
  base: BASE,

  // `.vitepress/` mora em `website/`, então a raiz do projeto é `website/` e
  // todo caminho abaixo é relativo a ela: o conteúdo em `website/docs/`, os
  // assets estáticos em `website/docs/public/`.
  srcDir: 'docs',

  // `build` em vez do padrão `.vitepress/dist`: `pages-deploy.yml` publica
  // `website/build`, e `scripts/check-seo.mjs` varre `website/build/**/*.html`.
  outDir: 'build',

  // Herdado do `onBrokenLinks: 'throw'` do Docusaurus: um link interno morto
  // falha o build, não a leitura de quem chega pela primeira vez.
  ignoreDeadLinks: false,

  // URLs com `.html`, como as que o Docusaurus gerava: o GitHub Pages serve o
  // arquivo como está, e o canonical (`plugins/seo/url.js`) aponta para ele.
  cleanUrls: false,

  // Data do último commit de cada página, em três lugares: o rodapé visível
  // das páginas de doc ("Última atualização: …", rótulo traduzido por locale
  // em `navigationFor`), o `dateModified` do JSON-LD e o `<lastmod>` do
  // sitemap. Exige histórico completo no CI (`fetch-depth: 0` em
  // `pages-deploy.yml`) — num clone raso, toda página mostraria a data do
  // último commit do repositório.
  lastUpdated: true,

  // Canonical, hreflang, Open Graph, JSON-LD e sitemap — ver
  // `plugins/seo/index.js`.
  transformPageData: seo.transformPageData,
  transformHead: seo.transformHead,
  sitemap: seo.sitemap,

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
    root: localeConfig(ROOT_LOCALE, 'English'),
    'pt-br': localeConfig('pt-br', 'Português (Brasil)'),
    es: localeConfig('es', 'Español'),
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
