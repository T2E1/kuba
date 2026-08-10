// ✅ Handler por decorator, evento que atravessa o Shadow DOM, zero acoplamento.

import { CLICKED } from './interfaces.js'

class Card extends Hidden(Echo(HTMLElement)) {
  #value

  // Tipo → seletor → modificadores. O decorator registra e remove o listener
  // no momento certo do ciclo de vida — nada de addEventListener manual.
  @on.click('button', prevent)
  select() {
    this.dispatchEvent(
      new CustomEvent(CLICKED, {
        // bubbles: sobe pela árvore.
        // composed: atravessa a fronteira do Shadow DOM — sem isso o evento
        //           morre ali, mesmo com bubbles: true.
        // cancelable: o consumidor pode cancelar.
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: this.#value,
      }),
    )
    return this
  }

  // Modificador `enter` filtra a tecla; `value` entrega direto o valor do
  // target. O handler recebe o dado tratado, não o evento cru.
  @on.keydown('input', enter, value)
  submit(inputValue) {
    this.#value = inputValue
    return this
  }
}

// ─── interfaces.js ────────────────────────────────────────────────────────
// Nome de evento usado em mais de um lugar é constante, não string solta
// (rule 024). O consumidor importa daqui em vez de redigitar.
export const CLICKED = 'clicked'

// O Card não conhece ninguém. Quem quiser reagir, escuta:
//
//   document.addEventListener('clicked', (event) => toast.show(event.detail))
//
// Nenhuma dependência entre os dois (rule 018), e o Card é testável sozinho.
// O evento entra no types.d.ts com @fires e ganha uma story com `play`.
