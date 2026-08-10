// ✅ Estado em Element Internals, com contrato Symbol.

// ─── interfaces.js ────────────────────────────────────────────────────────
/** Contrato: sincroniza o estado `valid` com internals.states. */
export const validable = Symbol('validable')

// ─── input.js ─────────────────────────────────────────────────────────────
import { validable } from './interfaces.js'

class Input extends Echo(HTMLElement) {
  // 1 — campo privado: a única fonte de verdade
  #internals
  #valid

  // 2 — getters e setters
  get internals() {
    return (this.#internals ??= this.attachInternals())
  }

  get valid() {
    return (this.#valid ??= false)
  }

  // O setter atribui e nada mais. Quem toca internals.states é o método de
  // contrato, alcançado pelo `around` — uma responsabilidade por membro
  // (rule 010), e um mixin pode implementar o contrato sem tocar o setter.
  @attributeChanged
  @around(validable)
  set valid(value) {
    this.#valid = value
  }

  // 5 — método de contrato: trata um estado só
  [validable]() {
    if (this.valid) {
      this.internals.states.add('valid')
      return
    }
    this.internals.states.delete('valid')
  }
}

// No CSS, a pseudo-classe diz explicitamente que aquilo é um estado:
//
//   kb-input:state(valid) { border-color: var(--color-success) }
//
// Ganhos sobre o atributo:
//
// - Encapsulado: código externo não remove nem falsifica.
// - Fora do HTML serializado: nenhum contrato acidental se forma.
// - Um estado, um método: impossível `valid` e `invalid` coexistirem.
