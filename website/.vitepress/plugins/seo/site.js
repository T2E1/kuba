/**
 * O endereço público do site, escrito uma vez só. Canonical, hreflang,
 * `og:url`, todo `@id` do JSON-LD, o sitemap e a `base` do VitePress
 * (`config.mts`) derivam daqui: migrar para um domínio próprio é trocar esta
 * linha. A barra final é obrigatória — sem ela, `new URL('page.html', SITE_URL)`
 * descarta o último segmento e a base `/kuba/` some de toda URL.
 */
export const SITE_URL = 'https://t2e1.github.io/kuba/'

export const SITE_NAME = 'kuba'

export const REPOSITORY_URL = 'https://github.com/T2E1/kuba'

export const PACKAGE_URL = 'https://www.npmjs.com/package/@t2e1/kuba'

export const LICENSE_URL = 'https://opensource.org/licenses/MIT'

export const ORGANIZATION = Object.freeze({
  name: 'T2E1',
  logo: 'img/logo.svg',
  sameAs: ['https://github.com/T2E1', PACKAGE_URL],
})

export const AUTHOR = Object.freeze({
  name: 'Cleber de M. Goncalves',
  sameAs: ['https://github.com/deMGoncalves'],
})

/** Formato que o designer entrega em `docs/public/img/og-*.png`. */
export const SHARE_IMAGE = Object.freeze({
  width: 1200,
  height: 630,
  type: 'image/png',
})
