/**
 * Markdown (com o HTML e os componentes Vue que as páginas do VitePress
 * misturam) reduzido a texto corrido — o que um buscador mostra num snippet.
 * Não é um parser: cobre o que `website/docs/` usa, e nada além.
 */
const FRONTMATTER = /^---\n[\s\S]*?\n---\n/
const NON_PROSE_BLOCKS = [
  /```[\s\S]*?```/g, // bloco de código cercado
  /<script[\s\S]*?<\/script>/g, // `<script setup>` dos componentes de página
  /<style[\s\S]*?<\/style>/g,
  /<!--[\s\S]*?-->/g,
]
const BLANK_LINE = /\n\s*\n/
// Bloco que não é parágrafo: título, lista, citação, tabela, container
// (`::: tip`), ou HTML/componente aberto em linha própria.
const NON_PARAGRAPH_START = /^\s*([#>|:<-]|\*\s|\d+\.\s)/
const FOOTNOTE_MARK = /<sup>[\s\S]*?<\/sup>/g
const HTML_TAG = /<\/?[a-zA-Z][^>]*>/g
const IMAGE = /!\[[^\]]*\]\([^)]*\)/g
const LINK = /\[([^\]]*)\]\([^)]*\)/g
const EMPHASIS = /\*{1,3}|_{2,3}/g
const INLINE_CODE_FENCE = '`'
const WHITESPACE = /\s+/g

const stripNonProse = (source) =>
  NON_PROSE_BLOCKS.reduce(
    (text, pattern) => text.replace(pattern, '\n\n'),
    source,
  )

// Tag HTML some, mas a que está dentro de código inline é conteúdo:
// "wire `<kb-redirect>` to the button" mantém o nome do elemento.
// `split` pelo acento grave alterna fora/dentro: índices ímpares são código.
const stripTagsOutsideCode = (text) => {
  const segments = text.split(INLINE_CODE_FENCE)
  const cleaned = segments.map((segment, index) =>
    index % 2 ? segment : segment.replace(HTML_TAG, ''),
  )
  return cleaned.join('')
}

/** @param {string} block um bloco de markdown, sem linhas em branco */
export function plainText(block) {
  const withoutMarks = block.replace(FOOTNOTE_MARK, '')
  const withoutImages = withoutMarks.replace(IMAGE, '')
  const withoutLinks = withoutImages.replace(LINK, '$1')
  const withoutTags = stripTagsOutsideCode(withoutLinks)
  const withoutEmphasis = withoutTags.replace(EMPHASIS, '')
  return withoutEmphasis.replace(WHITESPACE, ' ').trim()
}

/**
 * O primeiro parágrafo de prosa da página, em texto corrido. Bloco feito só
 * de links — a fileira de botões de um herói — não conta como parágrafo.
 *
 * @param {string} source o markdown inteiro da página
 * @returns {string} vazio quando a página não tem parágrafo de prosa
 */
export function firstParagraph(source) {
  const body = stripNonProse(source.replace(FRONTMATTER, ''))
  const blocks = body.split(BLANK_LINE)
  const paragraphs = blocks.filter((block) => !NON_PARAGRAPH_START.test(block))
  const prose = paragraphs.find((block) => block.replace(LINK, '').trim())
  return prose ? plainText(prose) : ''
}
