// ✅ Comando devolve `this`; consulta devolve valor; a flag virou dois nomes.

class QueryBuilder {
  #cache
  #conditions = []

  // Comando: altera estado e devolve `this` para encadear (rule 038).
  where(condition) {
    this.#conditions.push(condition)
    return this
  }

  limit(count) {
    this.#limit = count
    return this
  }

  // Consulta: devolve o valor, não `this`. Nenhum estado alterado.
  build() {
    return this.#conditions.join(' AND ')
  }

  // A flag virou dois métodos com nome de intenção (rule 037). Cada um tem
  // um caminho só — dois testes simples em vez de quatro combinações.
  buildCached() {
    return (this.#cache ??= this.build())
  }
}

// Do lado do cliente, a intenção se lê de cima para baixo:
//
//   const sql = new QueryBuilder()
//     .where('id = 1')
//     .where('status = active')
//     .limit(10)
//     .buildCached()
//
// Uma chamada por linha (rule 005): o encadeamento fluente é a exceção
// permitida da regra, mas a legibilidade continua valendo — cadeia longa
// numa linha só é ilegível ao depurar.
