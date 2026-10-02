import { languageAlternates } from './alternates.js'
import { localeByLang, localeOf } from './locales.js'
import { SITE_URL } from './site.js'
import { absoluteUrl } from './url.js'

// O VitePress agrupa as traduções de uma página e marca cada uma com o `lang`
// do locale em `config.mts` — que vem de `locales.js`. Um `lang` que a tabela
// não conhece lança (`localeByLang`) em vez de virar inglês em silêncio.
const translationOf = (link) => ({
  lang: localeByLang(link.lang).lang,
  url: absoluteUrl(link.url),
})

// Página sem tradução chega sem `links` (o VitePress só os gera para grupos
// de duas ou mais variantes). A política vale para ela também — o `<head>`
// declara a própria página, e `x-default` se ela for a inglesa —, então a
// única variante é reconstruída a partir do diretório do locale.
const onlyVariant = (item) => [{ lang: localeOf(item.url).lang, url: item.url }]

/**
 * URL absoluta a partir de `SITE_URL` — não da resolução relativa contra
 * `hostname`, que perde a base `/kuba/` se a barra final faltar — e os
 * alternates pela mesma política do `<head>` (`alternates.js`).
 *
 * @param {object} item item que o VitePress gerou, com `url` relativa
 */
function sitemapItem(item) {
  const variants = item.links ?? onlyVariant(item)
  const translations = variants.map(translationOf)
  return {
    ...item,
    url: absoluteUrl(item.url),
    links: languageAlternates(translations),
  }
}

// Sem `Object.freeze`: o VitePress entrega este objeto ao `SitemapStream`,
// que escreve `objectMode` nele (falha com "object is not extensible").
export const sitemap = {
  hostname: SITE_URL,
  transformItems: (items) => items.map(sitemapItem),
}
