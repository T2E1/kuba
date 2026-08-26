// Viola o public API do FSD — a mesma proibição da skill `revelation`.
// Correto em public-api.valid.js.

// ── entities/article/index.js ───────────────────────────────────────────────
// ERRO 1 — re-export com curinga. É o anti-padrão que a própria doc nomeia.
// Destrói a descoberta (ninguém sabe o que a slice expõe sem abrir os arquivos)
// e vaza interior por acidente: `normalize` e `ArticleSkeleton` viram contrato
// público sem que ninguém tenha decidido isso.
export * from './ui/ArticleCard.js'
export * from './api/fetchArticle.js'
export * from './model/article.js'

// ERRO 2 — lógica no index. O index é contrato, não implementação.
import { fetchArticle } from './api/fetchArticle.js'

export async function fetchArticleWithRetry(id) {
  try {
    return await fetchArticle(id)
  } catch {
    return fetchArticle(id)
  }
}

// ── pages/article-reader/ui/ArticleReaderPage.js ────────────────────────────
// ERRO 3 — import profundo, atravessando o index da slice.
// O caminho interno vira contrato de fato: renomear `ui/` quebra esta página,
// e nada avisou que isso era possível.
import { ArticleCard } from '@entities/article/ui/ArticleCard'
import { normalize } from '@entities/article/model/normalize'

// ERRO 4 — cross-import alcançando o interior da outra entity, sem @x.
// Mesmo entre entities, onde o cross-import é legítimo, a porta é o @x.
import { User } from '@entities/user/model/user'

export function ArticleReaderPage({ id }) {
  return ArticleCard(normalize({ id, author: User() }))
}
