import { isActive } from 'vitepress/dist/client/shared.js'

/**
 * O caminho, na árvore da sidebar, até o item cujo `link` é a página aberta:
 * os grupos ancestrais e o próprio item, nessa ordem.
 *
 * Uma árvore, um percurso, duas projeções. O fio de migalhas visível
 * (`Breadcrumb.vue`) mostra todos os degraus: "Construir UI / Componentes /
 * Card". O `BreadcrumbList` do JSON-LD (`plugins/seo/breadcrumb.js`, via
 * `config.mts`) descarta os grupos que não abrem numa página-índice, porque
 * ali todo degrau precisa de URL própria (`plugins/seo/breadcrumb.js:5-9`):
 * "kuba > Build UI > Card". O que é compartilhado é a trilha encontrada aqui —
 * nenhuma das duas leituras guarda uma cópia da árvore.
 *
 * `isActive` é o mesmo comparador de rota que `VPSidebarItem` usa para marcar
 * o item corrente (node_modules/vitepress/dist/client/theme-default/composables/sidebar.js:96) —
 * reaproveitado em vez de reescrito, para não divergir do critério "esta
 * página está ativa" que o resto do tema já segue.
 *
 * A sidebar é um objeto de várias árvores, uma por seção do navbar
 * (`navigation/sidebar.js`). A página aparece em uma só delas, então basta
 * percorrer as árvores até achá-la; uma árvore listada sob mais de uma chave
 * é percorrida uma vez só.
 *
 * @param {object[] | Record<string, object[]>} sidebar a sidebar resolvida do
 *   locale — uma árvore, ou o objeto de árvores por prefixo de rota
 * @param {string} path `relativePath` da página, ex. `pt-br/learn/introduction.md`
 * @returns {object[] | null} `null` quando a página não está na sidebar
 */
export function trailTo(sidebar, path) {
  const trees = Array.isArray(sidebar)
    ? [sidebar]
    : [...new Set(Object.values(sidebar ?? {}))]
  for (const tree of trees) {
    const trail = trailIn(tree, path)
    if (trail) {
      return trail
    }
  }
  return null
}

function trailIn(items, path) {
  for (const item of items) {
    const trail = trailThrough(item, path)
    if (trail) {
      return trail
    }
  }
  return null
}

function trailThrough(item, path) {
  if (item.link && isActive(path, item.link)) {
    return [item]
  }
  const nested = trailIn(item.items ?? [], path)
  return nested && [item, ...nested]
}
