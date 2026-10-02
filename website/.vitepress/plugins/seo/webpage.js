import {
  AUTHOR_ID,
  articleId,
  breadcrumbId,
  ORGANIZATION_ID,
  reference,
  SOFTWARE_ID,
  webpageId,
  websiteId,
} from './identifiers.js'

/**
 * Uma propriedade que só entra no nó quando tem valor: `{ ...optional(k, v) }`.
 * Valor falso (`undefined`, `null`, `false`, `''`) ou lista vazia omite a
 * propriedade — `"workTranslation": []` não diz nada ao buscador.
 *
 * @param {string} key nome da propriedade
 * @param {unknown} value o valor
 */
function optional(key, value) {
  const isEmptyList = Array.isArray(value) && value.length === 0
  if (!value || isEmptyList) {
    return {}
  }
  return { [key]: value }
}

const webpageReference = (variant) => reference(webpageId(variant.url))

/**
 * O inglês é o original; pt-BR e es são traduções dele. Só aponta para a
 * variante que existe como arquivo (`variantsOf`).
 *
 * @param {object} page contexto da página
 */
function translationLinks(page) {
  const others = page.variants.filter(
    (variant) => variant.locale !== page.locale,
  )
  if (page.locale.isDefault) {
    return optional('workTranslation', others.map(webpageReference))
  }
  const original = others.find((variant) => variant.locale.isDefault)
  return optional('translationOfWork', original && webpageReference(original))
}

/**
 * A página em si. O tipo e as propriedades próprias vêm do tipo de página
 * (`page-kinds.js`): `FAQPage` na home, `AboutPage` em "sobre", `WebPage` no
 * resto.
 *
 * @param {object} page contexto da página
 */
export function webpage(page) {
  return {
    '@type': page.kind.pageType,
    '@id': webpageId(page.url),
    url: page.url,
    name: page.title,
    description: page.description,
    inLanguage: page.locale.lang,
    isPartOf: reference(websiteId(page.locale)),
    primaryImageOfPage: { '@type': 'ImageObject', url: page.image },
    ...optional('dateModified', page.dateModified),
    ...optional(
      'breadcrumb',
      page.kind.hasBreadcrumb && reference(breadcrumbId(page.url)),
    ),
    ...translationLinks(page),
    ...page.kind.pageProperties(page),
  }
}

/**
 * O conteúdo da página como obra: `TechArticle` na documentação técnica,
 * `Article` no manifesto e no guia de contribuição.
 *
 * @param {object} page contexto da página
 * @param {string} type tipo schema.org do artigo
 */
export function article(page, type) {
  return {
    '@type': type,
    '@id': articleId(page.url),
    headline: page.title,
    description: page.description,
    inLanguage: page.locale.lang,
    image: page.image,
    ...optional('dateModified', page.dateModified),
    about: reference(SOFTWARE_ID),
    isPartOf: reference(websiteId(page.locale)),
    mainEntityOfPage: reference(webpageId(page.url)),
    author: reference(AUTHOR_ID),
    publisher: reference(ORGANIZATION_ID),
  }
}
