/**
 * Leitura do `<head>` que o VitePress escreve. Não é um parser de HTML: lê a
 * forma exata que `renderHead` produz — atributo entre aspas duplas, valor
 * escapado com entidades.
 */
const HEAD_END = '</head>'
const TAG = /<(link|meta)\b([^>]*)>/g
const ATTRIBUTE = /([a-zA-Z][\w:-]*)="([^"]*)"/g
const JSON_LD = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
const ENTITY = /&(amp|quot|#39|lt|gt);/g
const CHARACTER_OF = {
  '&amp;': '&',
  '&quot;': '"',
  '&#39;': "'",
  '&lt;': '<',
  '&gt;': '>',
}

const decode = (value) =>
  value.replace(ENTITY, (entity) => CHARACTER_OF[entity])

const attributesOf = (source) => {
  const pairs = [...source.matchAll(ATTRIBUTE)]
  return Object.fromEntries(
    pairs.map(([, name, value]) => [name, decode(value)]),
  )
}

const tagsOf = (head) => {
  const matches = [...head.matchAll(TAG)]
  return matches.map(([, tag, source]) => ({ tag, ...attributesOf(source) }))
}

const linksWith = (tags, rel) =>
  tags.filter((entry) => entry.tag === 'link' && entry.rel === rel)

// `<meta property="og:…">` e `<meta name="twitter:…">` respondem pela mesma
// chave: quem lê não precisa saber qual dos dois atributos a tag usa.
// Lista, não valor único: duas `<meta name="description">` no mesmo head é
// defeito que só aparece contando.
const metaContents = (tags) => (key) => {
  const metaTags = tags.filter((entry) => entry.tag === 'meta')
  const found = metaTags.filter(
    (entry) => entry.property === key || entry.name === key,
  )
  return found.map((entry) => entry.content)
}

/**
 * @param {string} html o arquivo `.html` inteiro
 */
export function readHead(html) {
  const head = html.slice(0, html.indexOf(HEAD_END))
  const tags = tagsOf(head)
  const canonicalTags = linksWith(tags, 'canonical')
  const blocks = [...head.matchAll(JSON_LD)]
  const metaAll = metaContents(tags)
  return {
    canonicals: canonicalTags.map((entry) => entry.href),
    alternates: linksWith(tags, 'alternate'),
    metaAll,
    meta: (key) => metaAll(key)[0],
    jsonLd: blocks.map(([, source]) => source),
  }
}
