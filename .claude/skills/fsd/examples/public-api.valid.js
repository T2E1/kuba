// Correto: cada slice expõe um index que re-exporta apenas o contrato.
// O consumidor nunca escreve o caminho interno.

// ── entities/article/index.js ───────────────────────────────────────────────
// Re-export nomeado, um por símbolo público. Três propriedades entregues:
// proteção contra refatoração, consistência de comportamento, exposição mínima.
export { ArticleCard } from './ui/ArticleCard.js'
export { fetchArticle } from './api/fetchArticle.js'
export { Article } from './model/article.js'

// `./model/normalize.js` e `./ui/ArticleSkeleton.js` existem, mas NÃO são
// exportados: são interior. Mover, renomear ou apagar qualquer um deles não
// alcança nenhum consumidor.

// ── entities/article/@x/comment.js ──────────────────────────────────────────
// Public API dedicado ao cross-import: só o que a slice `comment` precisa de
// `article`. Declara a relação em vez de abrir a slice inteira.
export { Article } from '../model/article.js'

// ── entities/comment/model/comment.js ───────────────────────────────────────
// O cross-import legítimo entre entities, pela porta declarada.
import { Article } from '@entities/article/@x/comment'

export function Comment({ text, articleId }) {
  return { text, article: Article({ id: articleId }) }
}

// ── pages/article-reader/ui/ArticleReaderPage.js ────────────────────────────
// O consumidor importa pelo index da slice, nunca pelo interior.
import { ArticleCard, fetchArticle } from '@entities/article'

export async function ArticleReaderPage({ id }) {
  return ArticleCard(await fetchArticle(id))
}
