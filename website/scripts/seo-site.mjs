import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { robotsErrors, sitemapErrors } from './seo-sitemap.mjs'

/**
 * O que só se verifica olhando o site inteiro: hreflang recíproco, `@id`
 * citado que existe em algum grafo, imagem de compartilhamento que existe, e
 * o sitemap e o robots.txt (`seo-sitemap.mjs`).
 */
const FALLBACK_HREFLANG = 'x-default'
const DIRECTORY_URL = /\/$/
const INDEX_FILE = 'index.html'

const failIf = (condition, message) => (condition ? [message] : [])

/**
 * O arquivo do build que serve a URL, ou `undefined` para URL de fora do site.
 *
 * @param {string} url URL absoluta
 * @param {string} siteUrl endereço do site, com barra final
 * @param {string} directory diretório do build
 */
function fileOf(url, siteUrl, directory) {
  if (!url.startsWith(siteUrl)) {
    return undefined
  }
  const path = url.slice(siteUrl.length)
  const isDirectory = path === '' || DIRECTORY_URL.test(path)
  return join(directory, isDirectory ? `${path}${INDEX_FILE}` : path)
}

const translationsOf = (page) =>
  page.alternates.filter((link) => link.hreflang !== FALLBACK_HREFLANG)

// Toda tradução declarada tem de existir e declarar a página de volta — o
// Google ignora o par de hreflang que não é recíproco. O `x-default` não
// conta como volta: ele aponta para o inglês mesmo quando o par en sumiu.
function translationErrors(page, pageByUrl) {
  return translationsOf(page).flatMap((link) => {
    const target = pageByUrl.get(link.href)
    const backLinks = target ? translationsOf(target) : []
    const pointsBack = backLinks.some((back) => back.href === page.url)
    return [
      ...failIf(
        !target,
        `${page.file}: hreflang ${link.hreflang} → ${link.href} is not a page`,
      ),
      ...failIf(
        target && !pointsBack,
        `${page.file}: ${link.href} does not point back`,
      ),
    ]
  })
}

function alternateErrors(pages) {
  const pageByUrl = new Map(pages.map((page) => [page.url, page]))
  return pages.flatMap((page) => translationErrors(page, pageByUrl))
}

function unresolvedReferences(page, defined) {
  const missing = page.references.filter((id) => !defined.has(id))
  const unique = [...new Set(missing)]
  return unique.map(
    (id) => `${page.file}: JSON-LD cites ${id}, defined nowhere`,
  )
}

function referenceErrors(pages) {
  const defined = new Set(pages.flatMap((page) => page.defined))
  return pages.flatMap((page) => unresolvedReferences(page, defined))
}

/**
 * @param {object[]} pages resultado de `inspectPage`, com `file`
 * @param {string} siteUrl endereço do site
 * @param {string} directory diretório do build
 */
export function siteErrors(pages, siteUrl, directory) {
  return [
    ...alternateErrors(pages),
    ...referenceErrors(pages),
    ...imageErrors(pages, siteUrl, directory),
    ...sitemapErrors(pages, siteUrl, directory),
    ...robotsErrors(siteUrl, directory),
  ]
}

// A imagem de `og:image` tem de estar no build: um link quebrado vira cartão
// sem imagem em toda rede social, sem nenhum outro sinal. Imagem hospedada
// fora do site não é verificável aqui, e não é listada.
function imageErrors(pages, siteUrl, directory) {
  const images = new Set(pages.map((page) => page.image))
  const local = [...images].filter((image) => image?.startsWith(siteUrl))
  const missing = local.filter(
    (image) => !existsSync(fileOf(image, siteUrl, directory)),
  )
  return missing.map((image) => `og:image ${image} is not in the build`)
}
