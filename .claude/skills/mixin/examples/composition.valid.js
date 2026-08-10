// ✅ Composição por mixin — cada componente pega só o que usa.

import { Echo } from '@echo'
import { Hidden, Width } from '@mixin'

// A cadeia se lê da esquerda para a direita, mas se aplica da direita para a
// esquerda: Echo envolve HTMLElement, Hidden envolve Echo, Width envolve Hidden.
//
// Echo está presente porque UserCard dispara evento — sem ele, o sistema de
// eventos não funciona.
class UserCard extends Width(Hidden(Echo(HTMLElement))) {
  // Só o que é exclusivamente deste componente mora aqui.
}

// Outro componente compõe uma cadeia diferente, sem arrastar o que não usa.
class Icon extends Hidden(Echo(HTMLElement)) {}

// Um mixin, isolado — não importa outro mixin, não conhece quem o compõe.
export const Width = (Super) =>
  class extends Super {
    #width

    static observedAttributes = [...(Super.observedAttributes ?? []), 'width']

    get width() {
      return this.#width
    }

    set width(value) {
      this.#width = value
      this.style.setProperty('--width', value)
    }
  }

// Ganhos diretos:
//
// - rule 010: uma responsabilidade por mixin.
// - rule 059: nenhum componente herda o que não usa.
// - rule 021: o comportamento de largura existe num lugar só.
// - A ordem é negociável quando não há dependência — e quando há, a razão
//   é documentada com JSDoc na classe (rule 026).
