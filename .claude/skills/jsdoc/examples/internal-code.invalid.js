// ❌ JSDoc redundante em código interno — viola as rules 026 e 062.
// Correto em: internal-code.valid.js

class Button extends WithEvents(WithVisibility(WithValue(HTMLElement))) {
  /**
   * Gets the name.
   * @returns {string} The name.
   */
  get name() {
    return this.#name
  }

  /**
   * Sets the color.
   * @param {string} color - The color.
   */
  set color(color) {
    this.#color = color
  }

  /**
   * Clicks the button.
   */
  click() {
    this.dispatchEvent(new CustomEvent('clicked', { detail: this.#value }))
  }
}

// Todo comentário acima repete o que o nome já diz. Apagar os três não perde
// nenhuma informação — e é exatamente esse o teste.
//
// Pior: o que realmente não é óbvio ficou sem documentação. A ordem dos
// mixins é significativa e um refactor inocente pode invertê-la.
