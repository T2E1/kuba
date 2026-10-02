import { readGraph, referencesIn } from './seo-graph.mjs'
import { readHead } from './seo-head.mjs'

const FALLBACK_HREFLANG = 'x-default'
const REQUIRED_META = [
  'description',
  'og:type',
  'og:title',
  'og:description',
  'og:url',
  'og:image',
  'og:locale',
  'og:site_name',
  'twitter:card',
]

const failIf = (condition, message) => (condition ? [message] : [])

function canonicalErrors(head, url) {
  const [canonical] = head.canonicals
  return [
    ...failIf(
      head.canonicals.length !== 1,
      `expected 1 canonical, found ${head.canonicals.length}`,
    ),
    ...failIf(
      canonical && canonical !== url,
      `canonical ${canonical} is not ${url}`,
    ),
  ]
}

function alternateErrors(head, url) {
  const languages = head.alternates.map((alternate) => alternate.hreflang)
  const repeated = languages.filter(
    (language, index) => languages.indexOf(language) !== index,
  )
  const listsItself = head.alternates.some(
    (alternate) =>
      alternate.href === url && alternate.hreflang !== FALLBACK_HREFLANG,
  )
  return [
    ...failIf(!listsItself, 'hreflang does not list the page itself'),
    ...failIf(
      !languages.includes(FALLBACK_HREFLANG),
      'hreflang x-default is missing',
    ),
    ...repeated.map((language) => `hreflang ${language} declared twice`),
  ]
}

function metaErrors(head, url) {
  const missing = REQUIRED_META.filter((key) => !head.meta(key))
  const openGraphUrl = head.meta('og:url')
  const descriptions = head.metaAll('description')
  return [
    ...missing.map((key) => `missing <meta> ${key}`),
    ...failIf(
      descriptions.length > 1,
      `expected 1 <meta name="description">, found ${descriptions.length}`,
    ),
    ...failIf(
      openGraphUrl && openGraphUrl !== url,
      `og:url ${openGraphUrl} is not ${url}`,
    ),
  ]
}

function jsonLdErrors(head, graph, url) {
  const describesPage = graph.nodes.some((node) => node.url === url)
  return [
    ...failIf(
      head.jsonLd.length !== 1,
      `expected 1 JSON-LD script, found ${head.jsonLd.length}`,
    ),
    ...graph.errors,
    ...failIf(!describesPage, `JSON-LD has no node whose url is ${url}`),
  ]
}

/**
 * Tudo o que dá para verificar olhando uma página sozinha, e o que ela
 * declara para a verificação entre páginas (`check-seo.mjs`).
 *
 * @param {string} html o arquivo `.html` inteiro
 * @param {string} url a URL canônica esperada para o arquivo
 */
export function inspectPage(html, url) {
  const head = readHead(html)
  const graph = readGraph(head.jsonLd[0] ?? '{}')
  return {
    url,
    alternates: head.alternates,
    image: head.meta('og:image'),
    defined: graph.nodes.map((node) => node['@id']),
    references: referencesIn(graph.nodes),
    errors: [
      ...canonicalErrors(head, url),
      ...alternateErrors(head, url),
      ...metaErrors(head, url),
      ...jsonLdErrors(head, graph, url),
    ],
  }
}
