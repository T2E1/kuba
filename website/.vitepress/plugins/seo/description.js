import { firstParagraph } from './markdown-text.js'

// O que o Google costuma exibir de um `<meta name="description">` antes de
// cortar com reticências.
const SNIPPET_LENGTH = 155
const ELLIPSIS = '…'
const TRAILING_PUNCTUATION = /[\s,;:—–-]+$/

/**
 * Corta no último espaço antes do limite — nunca no meio de uma palavra.
 *
 * @param {string} text texto corrido, sem quebras de linha
 */
export function snippet(text) {
  if (text.length <= SNIPPET_LENGTH) {
    return text
  }
  const room = text.slice(0, SNIPPET_LENGTH - ELLIPSIS.length)
  const wholeWords = room.slice(0, room.lastIndexOf(' '))
  return `${wholeWords.replace(TRAILING_PUNCTUATION, '')}${ELLIPSIS}`
}

/**
 * A descrição de uma página que não declara `description` no frontmatter: o
 * primeiro parágrafo de prosa, ou a do locale quando a página não tem um.
 *
 * @param {string} source markdown inteiro da página
 * @param {string} fallback descrição do locale
 */
export function derivedDescription(source, fallback) {
  const paragraph = firstParagraph(source)
  return paragraph ? snippet(paragraph) : fallback
}
