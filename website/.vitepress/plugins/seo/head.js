import { languageAlternates } from './alternates.js'
import { graphOf, serialize } from './graph.js'
import { pageContext } from './page-context.js'
import { SHARE_IMAGE, SITE_NAME } from './site.js'

// O 404 não é uma página a indexar: sem canonical, sem idioma, sem grafo.
const NOT_FOUND_PAGE = '404.md'
const TWITTER_CARD = 'summary_large_image'
const JSON_LD_TYPE = 'application/ld+json'

const property = (name, content) => ['meta', { property: name, content }]

const alternateLink = (hreflang, href) => [
  'link',
  { rel: 'alternate', hreflang, href },
]

/**
 * Os `<link rel="alternate">` da página, pela política de `alternates.js` —
 * a mesma que o sitemap segue.
 *
 * @param {object} page contexto da página
 */
function languageLinks(page) {
  const translations = page.variants.map((variant) => ({
    lang: variant.locale.lang,
    url: variant.url,
  }))
  const alternates = languageAlternates(translations)
  return alternates.map((alternate) =>
    alternateLink(alternate.lang, alternate.url),
  )
}

// A `<meta name="description">` sai daqui, e não do VitePress: quando o head
// já tem uma, ele omite a sua (`isDescriptionOverridden`), e aqui o valor
// passa por `renderAttrs`, que escapa aspas — a dele é escrita sem escape
// (node_modules/vitepress/dist/node/chunk-D3CUZ4fa.js:49469, :49536-49551).
const descriptionMeta = (page) => [
  'meta',
  { name: 'description', content: page.description },
]

/**
 * @param {object} page contexto da página
 * @param {string} title o `<title>` já montado pelo VitePress
 */
function openGraph(page, title) {
  const alternates = page.variants.filter(
    (variant) => variant.locale !== page.locale,
  )
  return [
    property('og:type', page.kind.ogType),
    property('og:site_name', SITE_NAME),
    property('og:title', title),
    property('og:description', page.description),
    property('og:url', page.url),
    property('og:image', page.image),
    property('og:image:type', SHARE_IMAGE.type),
    property('og:image:width', String(SHARE_IMAGE.width)),
    property('og:image:height', String(SHARE_IMAGE.height)),
    property('og:locale', page.locale.ogLocale),
    ...alternates.map((variant) =>
      property('og:locale:alternate', variant.locale.ogLocale),
    ),
    ['meta', { name: 'twitter:card', content: TWITTER_CARD }],
  ]
}

/**
 * `transformHead`: description, canonical, hreflang, Open Graph e um único
 * `<script type="application/ld+json">` com o `@graph` da página. Roda só no
 * build — o servidor de desenvolvimento não chama `transformHead`.
 *
 * @param {object} options `{ version, trailFor }`, injetados por `config.mts`
 */
export function createTransformHead(options) {
  return (context) => {
    if (context.page === NOT_FOUND_PAGE) {
      return []
    }
    const page = pageContext(context, options)
    return [
      descriptionMeta(page),
      ['link', { rel: 'canonical', href: page.url }],
      ...languageLinks(page),
      ...openGraph(page, context.title),
      ['script', { type: JSON_LD_TYPE }, serialize(graphOf(page))],
    ]
  }
}
