// ✅ Domain Model rico — a regra de negócio mora na entidade, não no cliente.

export class Order {
  #lines
  #status

  constructor({ lines, status = 'draft' }) {
    this.#lines = lines
    this.#status = status
  }

  // A entidade decide se pode ser confirmada. Quem chama não precisa
  // conhecer a regra — só dizer a intenção (rule 009, Tell Don't Ask).
  confirm() {
    if (this.#lines.length === 0) throw new EmptyOrderError(this)
    if (this.#status !== 'draft') throw new OrderAlreadyConfirmedError(this)
    this.#status = 'confirmed'
  }

  total() {
    return this.#lines.reduce((sum, line) => sum + line.subtotal(), 0)
  }
}

// O ganho concreto: `order.confirm()` é a única forma de mudar o status.
// Nenhum cliente decide a regra por fora — ela vive uma vez só, na entidade.
