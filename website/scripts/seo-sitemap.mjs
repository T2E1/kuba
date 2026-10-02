import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * O sitemap e o `robots.txt` que o anuncia, conferidos contra as páginas do
 * build: o mesmo conjunto de URLs (sem falta, sem sobra, sem duplicata) e,
 * em cada URL, os mesmos alternates que o `<head>` declara.
 */
const SITEMAP_FILE = 'sitemap.xml'
const ROBOTS_FILE = 'robots.txt'
const FALLBACK_HREFLANG = 'x-default'
const URL_ENTRY = /<url>([\s\S]*?)<\/url>/g
const LOCATION = /<loc>([^<]*)<\/loc>/
const ALTERNATE =
  /<xhtml:link rel="alternate" hreflang="([^"]*)" href="([^"]*)"\/>/g

const failIf = (condition, message) => (condition ? [message] : [])

const alternateKey = ({ hreflang, href }) => `${hreflang} ${href}`

const entryOf = ([, body]) => {
  const alternates = [...body.matchAll(ALTERNATE)]
  return {
    loc: body.match(LOCATION)?.[1],
    alternates: alternates.map(([, hreflang, href]) => ({ hreflang, href })),
  }
}

/** @param {string} xml o `sitemap.xml` inteiro */
export function readSitemap(xml) {
  const entries = [...xml.matchAll(URL_ENTRY)]
  return entries.map(entryOf)
}

// Conjunto, não contagem: uma URL duplicada e outra faltando dão o mesmo
// total, e passariam numa comparação de tamanho.
function coverageErrors(entries, pages) {
  const listed = entries.map((entry) => entry.loc)
  const repeated = listed.filter((loc, index) => listed.indexOf(loc) !== index)
  const expected = new Set(pages.map((page) => page.url))
  const missing = [...expected].filter((url) => !listed.includes(url))
  const extra = listed.filter((loc) => !expected.has(loc))
  return [
    ...[...new Set(repeated)].map(
      (loc) => `${SITEMAP_FILE}: ${loc} listed twice`,
    ),
    ...missing.map((url) => `${SITEMAP_FILE}: ${url} is missing`),
    ...extra.map((loc) => `${SITEMAP_FILE}: ${loc} is not a page of the build`),
  ]
}

const relativeAlternates = (entry, siteUrl) =>
  entry.alternates.filter((alternate) => !alternate.href.startsWith(siteUrl))

// O sitemap e o `<head>` seguem a mesma política (`plugins/seo/alternates.js`);
// aqui se confere que o resultado publicado é de fato o mesmo.
function headMismatch(entry, page) {
  const inSitemap = new Set(entry.alternates.map(alternateKey))
  const inHead = new Set(page.alternates.map(alternateKey))
  const same =
    inSitemap.size === inHead.size &&
    [...inHead].every((key) => inSitemap.has(key))
  return failIf(
    !same,
    `${SITEMAP_FILE}: alternates of ${entry.loc} differ from its <head>`,
  )
}

const translationsOf = (entry) =>
  entry.alternates.filter(
    (alternate) => alternate.hreflang !== FALLBACK_HREFLANG,
  )

// O `x-default` não conta como volta: ele aponta para o inglês mesmo quando
// o par en sumiu da entrada traduzida.
function pointsBack(entry, entryByLoc) {
  const strays = translationsOf(entry).filter((alternate) => {
    const target = entryByLoc.get(alternate.href)
    const backLinks = target ? translationsOf(target) : []
    return !backLinks.some((back) => back.href === entry.loc)
  })
  return strays.map(
    (alternate) =>
      `${SITEMAP_FILE}: ${alternate.href} does not point back to ${entry.loc}`,
  )
}

function alternateErrors(entries, pages, siteUrl) {
  const pageByUrl = new Map(pages.map((page) => [page.url, page]))
  const entryByLoc = new Map(entries.map((entry) => [entry.loc, entry]))
  const known = entries.filter((entry) => pageByUrl.has(entry.loc))
  return known.flatMap((entry) => [
    ...relativeAlternates(entry, siteUrl).map(
      (alternate) =>
        `${SITEMAP_FILE}: ${alternate.href} is not an absolute URL of the site`,
    ),
    ...pointsBack(entry, entryByLoc),
    ...headMismatch(entry, pageByUrl.get(entry.loc)),
  ])
}

/**
 * @param {object[]} pages resultado de `inspectPage`
 * @param {string} siteUrl endereço do site
 * @param {string} directory diretório do build
 */
export function sitemapErrors(pages, siteUrl, directory) {
  const file = join(directory, SITEMAP_FILE)
  if (!existsSync(file)) {
    return [`${SITEMAP_FILE} was not generated`]
  }
  const entries = readSitemap(readFileSync(file, 'utf8'))
  return [
    ...coverageErrors(entries, pages),
    ...alternateErrors(entries, pages, siteUrl),
  ]
}

/**
 * Coerência, não eficácia. Em `https://t2e1.github.io/kuba/` o arquivo é
 * servido em `/kuba/robots.txt`, e crawler nenhum lê ali — robots.txt só vale
 * na raiz do host. Esta checagem garante que a linha `Sitemap:` acompanha
 * `SITE_URL`, para o dia em que o site tiver domínio próprio; até lá, o
 * sitemap é enviado à mão no Search Console e no Bing Webmaster Tools.
 *
 * @param {string} siteUrl endereço do site
 * @param {string} directory diretório do build
 */
export function robotsErrors(siteUrl, directory) {
  const file = join(directory, ROBOTS_FILE)
  if (!existsSync(file)) {
    return [`${ROBOTS_FILE} is missing from the build`]
  }
  const expected = `Sitemap: ${siteUrl}${SITEMAP_FILE}`
  const robots = readFileSync(file, 'utf8')
  const lines = robots.split('\n')
  return failIf(
    !lines.includes(expected),
    `${ROBOTS_FILE} lacks the line "${expected}"`,
  )
}
