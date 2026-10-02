import { join } from 'node:path'
import { localeOf } from './locales.js'
import { kindOf } from './page-kinds.js'
import { absoluteUrl, pageUrl, sharedPathOf, variantsOf } from './url.js'

// `pageData.lastUpdated` é o timestamp do último commit do arquivo
// (`lastUpdated: true` em `config.mts`); 0 ou `NaN` quando o git não sabe.
const isKnownDate = (timestamp) => Number.isFinite(timestamp) && timestamp > 0

const modifiedAt = (timestamp) =>
  isKnownDate(timestamp) ? new Date(timestamp).toISOString() : undefined

/**
 * Tudo o que o `<head>` e o grafo de uma página precisam saber, calculado uma
 * vez por página.
 *
 * @param {object} context o argumento de `transformHead` do VitePress
 * @param {object} options `{ version, trailFor }`, injetados por `config.mts`
 */
export function pageContext({ pageData, siteConfig, description }, options) {
  const { relativePath } = pageData
  const locale = localeOf(relativePath)
  return {
    relativePath,
    locale,
    kind: kindOf(sharedPathOf(relativePath)),
    url: pageUrl(relativePath),
    title: pageData.title,
    description,
    image: absoluteUrl(locale.image),
    dateModified: modifiedAt(pageData.lastUpdated),
    variants: variantsOf(relativePath, siteConfig.srcDir),
    trail: options.trailFor(relativePath, locale.key),
    version: options.version,
    sourceFile: join(siteConfig.srcDir, pageData.filePath),
  }
}
