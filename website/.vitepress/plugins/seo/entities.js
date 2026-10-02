import {
  AUTHOR_ID,
  ORGANIZATION_ID,
  reference,
  SOFTWARE_ID,
  websiteId,
} from './identifiers.js'
import {
  AUTHOR,
  LICENSE_URL,
  ORGANIZATION,
  PACKAGE_URL,
  REPOSITORY_URL,
  SITE_NAME,
} from './site.js'
import { absoluteUrl } from './url.js'

/**
 * Os nós que não pertencem a uma página: quem publica, quem escreve, o site
 * de cada idioma e a própria biblioteca.
 */
export function organization() {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: ORGANIZATION.name,
    url: absoluteUrl(''),
    logo: { '@type': 'ImageObject', url: absoluteUrl(ORGANIZATION.logo) },
    sameAs: ORGANIZATION.sameAs,
  }
}

export function author() {
  return {
    '@type': 'Person',
    '@id': AUTHOR_ID,
    name: AUTHOR.name,
    sameAs: AUTHOR.sameAs,
  }
}

/** @param {object} locale entrada de `locales.js` */
export function website(locale) {
  return {
    '@type': 'WebSite',
    '@id': websiteId(locale),
    url: absoluteUrl(locale.prefix),
    name: SITE_NAME,
    description: locale.description,
    inLanguage: locale.lang,
    publisher: reference(ORGANIZATION_ID),
  }
}

/**
 * A biblioteca. Completa só na home e em "sobre"; as demais páginas a citam
 * por `{ "@id" }`.
 *
 * @param {object} page contexto da página (`page-context.js`)
 */
export function software(page) {
  return {
    '@type': ['SoftwareApplication', 'SoftwareSourceCode'],
    '@id': SOFTWARE_ID,
    name: SITE_NAME,
    description: page.locale.description,
    url: absoluteUrl(''),
    applicationCategory: 'DeveloperApplication',
    runtimePlatform: 'Web Browser',
    programmingLanguage: 'JavaScript',
    codeRepository: REPOSITORY_URL,
    downloadUrl: PACKAGE_URL,
    license: LICENSE_URL,
    isAccessibleForFree: true,
    softwareVersion: page.version,
    keywords: page.locale.keywords.join(', '),
    author: reference(AUTHOR_ID),
    publisher: reference(ORGANIZATION_ID),
  }
}
