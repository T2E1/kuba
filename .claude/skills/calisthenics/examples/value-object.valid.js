// ✅ Regra 3 — o conceito de domínio vira um Value Object imutável (rule 003).
//
// A validação acontece uma vez, no construtor: se a instância existe, ela é
// válida. Object.freeze garante que continue válida (rule 029).
// O comportamento do conceito (comparar, formatar) mora junto com o valor.

class Email {
  static #PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

  #value

  constructor(value) {
    if (!Email.#PATTERN.test(value)) throw new InvalidEmailError(value)
    this.#value = value
    Object.freeze(this)
  }

  equals(other) {
    return this.#value === other.toString()
  }

  toString() {
    return this.#value
  }
}

// Agora a assinatura carrega a intenção, e nenhuma função revalida.
function sendInvoice(email) {}

function subscribe(email) {}
