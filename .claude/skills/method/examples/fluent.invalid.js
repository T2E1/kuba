// ❌ Nome genérico, sem retorno, flag decidindo o caminho.
// Correto em: fluent.valid.js

class QueryBuilder {
  #conditions = []

  // Sem retorno: cada chamada é uma instrução solta.
  where(condition) {
    this.#conditions.push(condition)
  }

  // rule 034: `process` não diz o que processa.
  // rule 037: `shouldCache` é flag — quem lê `process(true)` na chamada não
  //           faz ideia do que vai acontecer.
  // rule 038: híbrido — altera estado E devolve valor.
  process(shouldCache) {
    if (shouldCache) {
      this.#cache = this.#build()
      return this.#cache
    } else {
      return this.#build()
    }
  }
}

// Do lado do cliente, três instruções que não se conectam:
//
//   const query = new QueryBuilder()
//   query.where('id = 1')
//   query.where('status = active')
//   const result = query.process(true)
//
// O `else` (rule 002) e a flag tornam o método difícil de testar: são
// quatro combinações de caminho para cobrir onde deveriam existir duas
// funções com um caminho cada.
