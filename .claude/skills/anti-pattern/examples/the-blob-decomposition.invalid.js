// ❌ The Blob — uma classe concentra dado e comportamento de todo o domínio.
// Correto em: the-blob-decomposition.valid.js

class Order {
  #lines

  constructor(lines) {
    this.#lines = lines
  }

  total() {
    return this.#lines.reduce((sum, line) => sum + line.subtotal(), 0)
  }

  // Precificação, que é outra responsabilidade, mora aqui dentro.
  applyDiscount(rate) {
    return this.total() * (1 - rate)
  }

  // Formatação de saída também.
  renderInvoice() {
    return `Total: ${this.total()}`
  }

  // E persistência também.
  async save(database) {
    await database.query('UPDATE orders SET total = ?', this.total())
  }
}

// Consequências:
//
// - Quatro razões diferentes para mudar na mesma classe (rule 054,
//   Divergent Change): mudar a regra de desconto, o formato da fatura
//   ou o schema do banco, todos tocam Order.
// - Mais de 10 métodos públicos concentrados numa só classe é o sinal
//   objetivo de The Blob (rule 025).
// - Testar `applyDiscount` isoladamente exige simular banco e formato
//   de fatura, mesmo que o teste não se importe com nenhum dos dois.
