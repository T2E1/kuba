// ✅ Setter trata a escrita; a intenção de negócio virou método.

class Order extends HTMLElement {
  #email
  #status

  get email() {
    return this.#email
  }

  // Normaliza e valida antes de atribuir. Se a instância tem e-mail, ele
  // é válido — a garantia é do objeto, não de quem chama.
  set email(value) {
    const normalized = value.trim().toLowerCase()
    if (!EMAIL.test(normalized)) throw new InvalidEmailError(value)
    this.#email = normalized
  }

  get status() {
    return this.#status
  }

  // Sincroniza com o atributo HTML e dispara re-render parcial. O decorator
  // faz a ponte com attributeChangedCallback (skill render).
  @attributeChanged
  @retouch
  set status(value) {
    this.#status = value
  }

  // A operação de negócio é um método com nome de intenção, não uma
  // sequência de atribuições na mão do cliente (rule 009).
  cancel(reason) {
    if (this.#status === 'shipped') throw new AlreadyShippedError(this)
    this.status = 'cancelled'
    this.internals.states.add('cancelled')
    this.dispatchEvent(new CustomEvent('cancelled', { detail: reason }))
    return this
  }
}

// Do lado do cliente:
//
//   ❌  pedido.status = 'cancelado'; registrarMotivo(m); notificar()
//   ✅  pedido.cancel(motivo)
//
// Uma chamada, nenhum passo esquecido, estado impossível de corromper.
