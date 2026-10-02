import { createTransformHead } from './head.js'
import { transformPageData } from './page-data.js'
import { sitemap } from './sitemap.js'

export { localeByKey } from './locales.js'
export { SITE_URL } from './site.js'

/**
 * SEO do site: o que `config.mts` liga em `transformPageData`,
 * `transformHead` e `sitemap`.
 *
 * `version` é a versão do pacote que a doc carrega (`KUBA_VERSION`), e vira
 * o `softwareVersion` do JSON-LD. `trailFor(relativePath, localeKey)` devolve
 * a trilha da página na sidebar do locale — injetado para que este módulo não
 * conheça `navigation/`, e a árvore continue tendo uma fonte só.
 *
 * @param {{ version: string, trailFor: Function }} options
 */
export function createSeo(options) {
  return {
    transformPageData,
    transformHead: createTransformHead(options),
    sitemap,
  }
}
