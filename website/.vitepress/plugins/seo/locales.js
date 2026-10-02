/**
 * O que cada idioma do site declara para buscadores e redes sociais.
 *
 * `prefix` é o diretório do locale dentro de `srcDir` (vazio no inglês, que
 * mora na raiz). `lang` é a tag BCP 47 do idioma, e um campo só serve aos
 * dois usos — `<html lang>` e o `hreflang` do `<head>` e do sitemap —, que
 * aceitam a mesma tag; dois campos só poderiam divergir. `ogLocale` é o
 * formato de Open Graph (`língua_PAÍS`), que não é BCP 47 e por isso é outro
 * campo. `config.mts` lê `lang`, `description` e `titleTemplate` daqui.
 *
 * Tabela de configuração: os textos são dado, não lógica.
 */
const ENGLISH = Object.freeze({
  key: 'en',
  prefix: '',
  isDefault: true,
  lang: 'en',
  ogLocale: 'en_US',
  image: 'img/og-en.png',
  homeTitle: 'kuba — Web Components primitives, no framework, no build step',
  titleTemplate: ':title | kuba — Web Components',
  description:
    'Lightweight Web Components primitives and custom elements. No framework, no build step: elements talk through native DOM events, wired right in the HTML.',
  keywords: [
    'Web Components',
    'custom elements',
    'declarative event bus',
    'no framework',
    'no build step',
    'HTML',
    'JavaScript',
  ],
})

const PORTUGUESE = Object.freeze({
  key: 'pt-br',
  prefix: 'pt-br/',
  isDefault: false,
  lang: 'pt-BR',
  ogLocale: 'pt_BR',
  image: 'img/og-pt-br.png',
  homeTitle: 'kuba — primitivas de Web Components, sem framework e sem build',
  titleTemplate: ':title | kuba — Web Components nativos',
  description:
    'Primitivas leves e custom elements em Web Components. Sem framework, sem build: os elementos conversam por eventos nativos do DOM, ligados direto no HTML.',
  keywords: [
    'Web Components',
    'custom elements',
    'barramento de eventos declarativo',
    'sem framework',
    'sem build',
    'HTML',
    'JavaScript',
  ],
})

const SPANISH = Object.freeze({
  key: 'es',
  prefix: 'es/',
  isDefault: false,
  lang: 'es',
  ogLocale: 'es_ES',
  image: 'img/og-es.png',
  homeTitle: 'kuba — primitivas de Web Components, sin framework ni build',
  titleTemplate: ':title | kuba — Web Components nativos',
  description:
    'Primitivas ligeras y custom elements con Web Components. Sin framework ni build: los elementos se comunican por eventos nativos del DOM, conectados en el HTML.',
  keywords: [
    'Web Components',
    'custom elements',
    'bus de eventos declarativo',
    'sin framework',
    'sin build',
    'HTML',
    'JavaScript',
  ],
})

export const DEFAULT_LOCALE = ENGLISH

export const LOCALES = Object.freeze([ENGLISH, PORTUGUESE, SPANISH])

/**
 * O locale dono de uma página, pelo diretório em que ela mora. Não é
 * fallback: o inglês é dono da raiz de `srcDir`, então página fora de
 * `pt-br/` e `es/` é inglesa por construção, não por desconhecimento.
 *
 * @param {string} relativePath caminho da página em `srcDir`, ex. `es/about.md`
 */
export function localeOf(relativePath) {
  const prefixed = LOCALES.filter((locale) => locale.prefix)
  const owner = prefixed.find((locale) =>
    relativePath.startsWith(locale.prefix),
  )
  return owner ?? DEFAULT_LOCALE
}

// Locale que não está na tabela é erro de configuração — um idioma novo em
// `config.mts` sem entrada aqui. Cair no inglês publicaria hreflang e
// `<html lang>` errados em silêncio; falhar o build aponta o que falta.
function findLocale(field, value) {
  const locale = LOCALES.find((candidate) => candidate[field] === value)
  if (!locale) {
    throw new Error(
      `plugins/seo/locales.js has no locale with ${field} "${value}"`,
    )
  }
  return locale
}

/** @param {string} key chave do locale, ex. `pt-br` */
export function localeByKey(key) {
  return findLocale('key', key)
}

/** @param {string} lang tag BCP 47 do locale, ex. `pt-BR` */
export function localeByLang(lang) {
  return findLocale('lang', lang)
}
