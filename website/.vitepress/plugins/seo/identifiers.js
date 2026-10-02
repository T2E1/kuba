import { absoluteUrl } from './url.js'

/**
 * Os `@id` do grafo JSON-LD. Todo nó tem um, derivado da URL do que ele
 * descreve, e um nó de outra página é citado só por `{ "@id" }` — o buscador
 * junta os pedaços pelo identificador.
 */
export const ORGANIZATION_ID = absoluteUrl('#organization')
export const AUTHOR_ID = absoluteUrl('#author')
export const SOFTWARE_ID = absoluteUrl('#kuba')

/** @param {object} locale entrada de `locales.js` */
export const websiteId = (locale) => absoluteUrl(`${locale.prefix}#website`)

/** @param {string} url URL canônica da página */
export const webpageId = (url) => `${url}#webpage`

/** @param {string} url URL canônica da página */
export const articleId = (url) => `${url}#article`

/** @param {string} url URL canônica da página */
export const breadcrumbId = (url) => `${url}#breadcrumb`

/** @param {string} id um `@id` */
export const reference = (id) => ({ '@id': id })
