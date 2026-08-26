// O ganho de visibilidade que o eixo por feature possibilita: a maioria dos
// arquivos deixa de ser pública, porque seus consumidores estão na mesma pasta.
//
//   comment-form/
//   ├── index.js          ← a fronteira
//   ├── ui/field.js         interior
//   ├── model/validate.js   interior
//   └── api/postComment.js  interior

// ── comment-form/model/validate.js ──────────────────────────────────────────
// Interior. Exporta porque o irmão precisa, não porque o mundo precisa.
// Renomear, fundir ou apagar isto não alcança nenhum consumidor externo.
const MIN_LENGTH = 3

export function validateComment(text) {
  if (typeof text !== 'string') throw new TypeError('comment: text must be a string')
  return text.trim().length >= MIN_LENGTH
}

// ── comment-form/ui/field.js ────────────────────────────────────────────────
// Interior. Import relativo entre irmãos da mesma feature.
import { validateComment } from '../model/validate.js'

export function field(text) {
  return { text, valid: validateComment(text) }
}

// ── comment-form/index.js ───────────────────────────────────────────────────
// A fronteira. Um re-export por símbolo que é de fato contrato.
// `validateComment` e `field` NÃO aparecem: são interior deliberado.
export { CommentForm } from './ui/form.js'
export { postComment } from './api/postComment.js'

// ── article-reader/ui/reader.js — outra feature ─────────────────────────────
// O consumidor externo só enxerga o que o index oferece. A superfície da
// feature é de dois símbolos, não de quinze arquivos.
import { CommentForm } from '@comment-form'

export function reader(article) {
  return [article.body, CommentForm({ articleId: article.id })]
}
