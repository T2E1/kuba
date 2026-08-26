// Correto: todo import desce de layer.
// A ordem é app > pages > widgets > features > entities > shared.

// ── pages/article-reader/ui/ArticleReaderPage.js ────────────────────────────
// pages (3ª) importa de widgets (4ª), features (5ª), entities (6ª) e shared (7ª).
// Todas estritamente abaixo: legal.
import { Header } from '@widgets/header'
import { CommentForm } from '@features/comment-form'
import { ArticleCard } from '@entities/article'
import { Button } from '@shared/ui'

export function ArticleReaderPage({ id }) {
  return [Header(), ArticleCard({ id }), CommentForm({ id }), Button()]
}

// ── features/comment-form/ui/CommentForm.js ─────────────────────────────────
// features (5ª) importa de entities (6ª) e shared (7ª). Abaixo: legal.
import { Comment } from '@entities/comment'
import { post } from '@shared/api'

export function CommentForm({ id }) {
  return { submit: (text) => post(`/article/${id}/comment`, Comment({ text })) }
}

// ── shared/ui/Button.js ─────────────────────────────────────────────────────
// shared é a layer mais baixa: não importa de nenhuma outra layer.
// Como shared não tem slices, seus próprios arquivos se importam à vontade.
import { classNames } from '@shared/lib/class-names'

export function Button(props) {
  return { className: classNames('button', props.variant) }
}
