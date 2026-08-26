// Viola a regra de import do FSD: "um módulo só pode importar de layers
// estritamente abaixo". Correto em layer-import.valid.js.

// ── entities/article/ui/ArticleCard.js ──────────────────────────────────────
// ERRO 1 — import que SOBE de layer.
// entities é a 6ª layer; features é a 5ª, acima dela.
// Efeito: entities deixa de ser reusável sem arrastar a feature junto, e o
// grafo ganha um ciclo assim que a feature importar a entity de volta.
import { CommentForm } from '@features/comment-form'

export function ArticleCard({ id }) {
  return CommentForm({ id })
}

// ── features/comment-form/ui/CommentForm.js ─────────────────────────────────
// ERRO 2 — import lateral, entre slices da MESMA layer.
// features/comment-form e features/article-share são irmãs: não se enxergam.
// Efeito: as duas viram uma unidade só, e nenhuma pode ser removida sozinha.
import { shareUrl } from '@features/article-share'

export function CommentForm({ id }) {
  return { url: shareUrl(id) }
}

// ── entities/comment/model/comment.js ───────────────────────────────────────
// ERRO 3 — cross-import entre entities SEM a notação @x.
// Entre entities o cross-import é legítimo, mas só pelo public API dedicado:
// deveria ser '@entities/user/@x/comment', que declara a relação em vez de
// alcançar o interior da outra slice.
import { User } from '@entities/user'

export function Comment({ text, author }) {
  return { text, author: User(author) }
}
