// ✅ Responsabilidades decompostas — cada classe tem uma razão para mudar.

class Order {
  #lines
  constructor(lines) {
    this.#lines = lines
  }
  total() {
    return this.#lines.reduce((sum, line) => sum + line.subtotal(), 0)
  }
}

class OrderPricing {
  applyDiscount(order, discount) {
    return order.total() * (1 - discount.rate)
  }
}

class OrderInvoice {
  render(order) {
    return `Total: ${order.total()}`
  }
}

class OrderRepository {
  async save(order) {
    return this.database.query('UPDATE orders SET total = ?', order.total())
  }
}

// Nenhuma classe conhece as outras três por dentro — cada uma muda por
// um motivo só (rule 010), e nenhuma acumula os métodos das demais.
