import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { LOCALES, localeOf } from './locales.js'
import { SITE_URL } from './site.js'

// `cleanUrls: false` em `config.mts`: `learn/intro.md` vira
// `learn/intro.html`, e `components/index.md` vira o diretório `components/`.
const INDEX_FILE = /(^|\/)index\.md$/
const MARKDOWN_EXTENSION = /\.md$/
const HTML_EXTENSION = '.html'
const LEADING_SLASH = /^\//
const DIRECTORY_ROUTE = /(^|\/)$/
const HOME_PAGE = 'index.md'

/**
 * O caminho da página sem o prefixo do locale — o mesmo nos três idiomas:
 * `es/components/button.md` → `components/button.md`.
 *
 * @param {string} relativePath caminho da página em `srcDir`
 */
export function sharedPathOf(relativePath) {
  return relativePath.slice(localeOf(relativePath).prefix.length)
}

/**
 * A home do próprio locale (`index.md`, `pt-br/index.md`, `es/index.md`).
 * Aceita também o caminho já sem prefixo (`sharedPathOf`), que é a home do
 * inglês.
 *
 * @param {string} relativePath caminho da página em `srcDir`
 */
export function isHome(relativePath) {
  return sharedPathOf(relativePath) === HOME_PAGE
}

/** @param {string} path caminho relativo à raiz do site, sem barra inicial */
export function absoluteUrl(path) {
  return new URL(path, SITE_URL).href
}

/** @param {string} relativePath caminho da página em `srcDir`, ex. `learn/installation.md` */
export function pageUrl(relativePath) {
  const route = relativePath.replace(INDEX_FILE, '$1')
  return absoluteUrl(route.replace(MARKDOWN_EXTENSION, HTML_EXTENSION))
}

/**
 * URL de um `link` da sidebar (`/pt-br/learn/introduction`, `/components/`),
 * com a extensão que o VitePress acrescenta ao renderizá-lo.
 *
 * @param {string} link link como escrito em `navigation/sidebar.js`
 */
export function linkUrl(link) {
  const route = link.replace(LEADING_SLASH, '')
  const isDirectory = DIRECTORY_ROUTE.test(route)
  return absoluteUrl(isDirectory ? route : `${route}${HTML_EXTENSION}`)
}

/**
 * As traduções que existem de fato para a página — o hreflang só aponta para
 * arquivo que existe em `srcDir`, nunca para uma rota presumida.
 *
 * @param {string} relativePath caminho da página em `srcDir`
 * @param {string} sourceDirectory `siteConfig.srcDir`, absoluto
 */
export function variantsOf(relativePath, sourceDirectory) {
  const sharedPath = sharedPathOf(relativePath)
  const candidates = LOCALES.map((locale) => ({
    locale,
    relativePath: `${locale.prefix}${sharedPath}`,
  }))
  const existing = candidates.filter((variant) =>
    existsSync(join(sourceDirectory, variant.relativePath)),
  )
  return existing.map((variant) => ({
    ...variant,
    url: pageUrl(variant.relativePath),
  }))
}
