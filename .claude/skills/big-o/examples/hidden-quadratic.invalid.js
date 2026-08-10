// ❌ O(n·m) escondido — não há loop aninhado visível.
// Correto em: hidden-quadratic.valid.js

function attachAuthors(posts, authors) {
  return posts.map((post) => ({
    ...post,
    // `find` é uma varredura O(m). Dentro de um `map` O(n), o custo total é
    // O(n·m) — quadrático quando as duas coleções têm tamanho parecido.
    author: authors.find((author) => author.id === post.authorId),
  }))
}

function tagFeatured(posts, featuredIds) {
  return posts.map((post) => ({
    ...post,
    // Mesmo problema: `includes` é O(m) sobre um array.
    featured: featuredIds.includes(post.id),
  }))
}

// Este é o padrão que mais passa por code review sem ser notado: o código é
// idiomático, cabe numa linha e não tem `for` aninhado à vista. A varredura
// está escondida dentro de find/includes/indexOf.
//
// Regra de bolso: qualquer find, includes ou indexOf dentro de map, forEach
// ou filter é um loop aninhado disfarçado.
