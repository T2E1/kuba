// ✅ Contrato explícito via Symbol exportado.

// ─── mixin/interfaces.js ──────────────────────────────────────────────────
// O módulo dono do conceito define o Symbol, e interfaces.js é o único
// lugar de onde ele sai (rule 013).

/** Contrato: o componente reage ao pedido de ocultação do mixin Hideable. */
export const hideable = Symbol('hideable')

// ─── mixin/hideable.js ────────────────────────────────────────────────────
import { hideable } from './interfaces.js'

export const Hideable = (Super) =>
  class extends Super {
    hide() {
      // Falha alto se o contrato não for implementado, em vez de silenciar
      // com `?.()` — rule 027.
      if (!this[hideable]) throw new MissingContractError('hideable')
      this[hideable]()
    }
  }

// ─── component/dialog.js ──────────────────────────────────────────────────
import { hideable } from '@mixin/interfaces'

class Dialog extends Hideable(HTMLElement) {
  [hideable]() {
    this.removeAttribute('open')
  }
}

// O que muda em relação à string:
//
// - Sem colisão: dois mixins com Symbols distintos nunca disputam a chave,
//   mesmo que a descrição seja igual — identidade não é descrição.
// - Fora do namespace público: um consumidor não sobrescreve por acidente.
// - O contrato tem um lugar para existir e ser documentado — interfaces.js,
//   com JSDoc (skill jsdoc).
// - A falha é ruidosa: contrato não implementado lança na hora, em vez de
//   virar um controle do Storybook que "funciona" mas não faz nada.
