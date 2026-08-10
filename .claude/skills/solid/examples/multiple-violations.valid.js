// ✅ Os cinco princípios aplicados na mesma classe.
//
// S (rule 010): uma responsabilidade — processar um pedido.
// O (rule 011): um meio de pagamento novo é uma classe nova, não um if novo.
// L (rule 012): toda PaymentStrategy é substituível sem quebrar o processo.
// I (rule 013): a abstração expõe exatamente o que este cliente usa.
// D (rule 014): depende de abstrações injetadas, nunca de concretos.

class OrderProcessor {
  #payment
  #orders

  constructor(payment, orders) {
    this.#payment = payment
    this.#orders = orders
  }

  process(order) {
    this.#validate(order)
    this.#payment.pay(order)
    this.#orders.save(order)
  }

  #validate(order) {
    if (order.isValid()) return
    throw new InvalidOrderError(order)
  }
}

// L: as implementações são intercambiáveis — nenhuma enfraquece o contrato
// nem lança exceção que a abstração não prevê.

class CreditCardPayment {
  pay(order) {}
}

class PixPayment {
  pay(order) {}
}

// O: adicionar BoletoPayment não toca uma linha de OrderProcessor.
