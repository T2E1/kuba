// ✅ Ciclo quebrado por inversão de dependência — ADP (rule 018) via DIP (rule 014).
//
// A abstração pertence ao pacote do consumidor de alto nível (billing), não a
// um pacote "shared" genérico. billing define o que precisa; sales atende.
// O grafo vira um DAG: sales → billing, e nada volta.

// ─── billing/chargeable.js ────────────────────────────────────────────────
// O contrato mínimo que billing precisa. Uma responsabilidade (rule 013).

export class Chargeable {
  amount() {
    throw new NotImplementedError('Chargeable#amount')
  }
}

// ─── billing/payment.js ───────────────────────────────────────────────────
// Nenhum import de sales. Payment não sabe que Order existe.

export class Payment {
  #chargeable

  constructor(chargeable) {
    this.#chargeable = chargeable
  }

  authorize() {
    return this.#chargeable.amount()
  }
}

// ─── sales/order.js ───────────────────────────────────────────────────────
// Só sales conhece os dois lados — a dependência aponta numa direção só.

import { Payment } from '@billing/payment'

export class Order {
  amount() {
    return this.total
  }

  settle() {
    return new Payment(this).authorize()
  }
}
