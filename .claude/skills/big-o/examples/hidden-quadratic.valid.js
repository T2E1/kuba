// ✅ O(n + m) — o índice é construído uma vez, a busca vira O(1).

function attachAuthors(posts, authors) {
  // O(m) uma única vez, fora do loop.
  const authorsById = new Map(authors.map((author) => [author.id, author]))

  // O(n), com busca O(1) dentro.
  return posts.map((post) => ({
    ...post,
    author: authorsById.get(post.authorId),
  }))
}

function tagFeatured(posts, featuredIds) {
  // Set em vez de array: `has` é O(1), `includes` é O(m).
  const featured = new Set(featuredIds)

  return posts.map((post) => ({
    ...post,
    featured: featured.has(post.id),
  }))
}

// O padrão geral: quando precisar buscar repetidamente na mesma coleção,
// construa o índice uma vez antes do loop.
//
//   antes do loop:  new Map(...) ou new Set(...)   → O(m), uma vez
//   dentro do loop: .get() ou .has()               → O(1), n vezes
//
// Total O(n + m) em vez de O(n·m), e o código fica mais legível — a intenção
// "isto é um índice" fica explícita no nome.
