// ✅ Código interno — documenta só o que não se vê lendo linearmente (rule 026).

/**
 * The mixin order matters: the event-dispatching layer must wrap the
 * visibility layer so it captures the final `hidden` state at dispatch time.
 */
class Button extends WithEvents(WithVisibility(WithValue(HTMLElement))) {
  #color
  #name
  #value

  // Sem JSDoc: o nome já entrega tudo. A ausência de comentário é a
  // decisão correta, não um esquecimento.
  get name() {
    return this.#name
  }

  set color(color) {
    this.#color = color
  }

  /**
   * @remarks Dispatched during `attributeChangedCallback`, so `detail`
   * carries the value *before* the attribute is reflected back.
   */
  click() {
    this.dispatchEvent(new CustomEvent('clicked', { detail: this.#value }))
  }
}
