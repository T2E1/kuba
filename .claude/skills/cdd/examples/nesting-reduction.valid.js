// ✅ Aninhamento extraído — cada nível de decisão vira um método próprio.
// ICP projetado: CC_base 3, aninhamento 1, responsabilidades 1, acoplamento 2 → 7 🟡

class OrderCheckout {
  submit(order) {
    this.#assertValid(order)
    this.#persist(order)
    this.#notify(order)
  }

  #assertValid(order) {
    if (!order.isValid()) throw new InvalidOrderError(order)
  }

  #persist(order) {
    return this.repository.save(order)
  }

  #notify(order) {
    return this.notifier.orderSubmitted(order)
  }
}
