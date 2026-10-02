import { readFileSync } from 'node:fs'
import { plainText } from './markdown-text.js'

// Cada pergunta da home é um `<details>` com a pergunta no `<summary>` e a
// resposta, em markdown, no resto do bloco — o slot de `Faq.vue`. As duas
// tags podem levar atributos (`<details open>`, `<summary class="…">`).
// Uma FAQ que não casa nada sai com `mainEntity` vazio, e
// `scripts/check-seo.mjs` reprova o build.
const QUESTION_BLOCK =
  /<details\b[^>]*>\s*<summary\b[^>]*>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g

const question = ([, summary, answer]) => ({
  '@type': 'Question',
  name: plainText(summary),
  acceptedAnswer: { '@type': 'Answer', text: plainText(answer) },
})

/**
 * As perguntas da FAQ da home, lidas da fonte markdown do locale — a mesma
 * cópia que o leitor vê, sem uma segunda lista para divergir dela.
 *
 * @param {object} page contexto da página
 */
export function faqQuestions(page) {
  const source = readFileSync(page.sourceFile, 'utf8')
  const blocks = [...source.matchAll(QUESTION_BLOCK)]
  return blocks.map(question)
}
