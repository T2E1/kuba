import { DEFAULT_LOCALE } from './locales.js'

/** O `hreflang` de quem não fala nenhum dos idiomas do site. */
export const FALLBACK_HREFLANG = 'x-default'

/**
 * A política de idiomas alternativos, uma só para o `<head>` (`head.js`) e o
 * sitemap (`sitemap.js`): uma entrada por tradução que existe — inclusive a
 * própria página, como o Google pede — e `x-default` apontando para o inglês
 * quando ele existe.
 *
 * @param {{ lang: string, url: string }[]} translations as variantes da
 *   página, com a tag BCP 47 de `locales.js` e a URL absoluta
 * @returns {{ lang: string, url: string }[]}
 */
export function languageAlternates(translations) {
  const original = translations.find(
    (translation) => translation.lang === DEFAULT_LOCALE.lang,
  )
  const fallback = original
    ? [{ lang: FALLBACK_HREFLANG, url: original.url }]
    : []
  return [...translations, ...fallback]
}
