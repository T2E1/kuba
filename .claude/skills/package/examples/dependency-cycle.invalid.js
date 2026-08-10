// ❌ Ciclo de dependência entre pacotes — viola ADP (rule 018).
// Correto em: dependency-cycle.valid.js

// ─── sales/order.js ───────────────────────────────────────────────────────
import { Payment } from '@billing/payment'

export class Order {
  settle() {
    return new Payment(this).authorize()
  }
}

// ─── billing/payment.js ───────────────────────────────────────────────────
import { Order } from '@sales/order'

export class Payment {
  #order

  constructor(order) {
    // Precisa da classe concreta Order só para consultar o total.
    this.#order = order instanceof Order ? order : Order.from(order)
  }

  authorize() {
    return this.#order.total
  }
}

// sales → billing → sales. Os dois pacotes viraram um nó rígido:
// nenhum pode ser testado, publicado ou reusado sem arrastar o outro.
