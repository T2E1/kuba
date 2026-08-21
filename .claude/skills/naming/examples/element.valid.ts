// ✅ O padrão de src/component/button/button.ts.

import { attributeChanged, define } from '@directive'
import { paint, repaint } from '@dom'
import Echo, { dispatchEvent } from '@echo'
import { Hidden, Value } from '@mixin'
import component from './component.js'
import { variantable } from './interfaces.js' // plural, sempre
import style from './style.js'

// Tag: `kb-` + palavra única, sem hífen interno.
// Classe: a mesma palavra em PascalCase — a derivação é mecânica, e é o que
// permite à skill `types` montar KUBAFileuploadElement sem exceções.
@define('kb-fileupload')
@paint(component, style)
class Fileupload extends Echo(Hidden(Value(HTMLElement))) {
  // Campo privado espelha exatamente o acessor público. Alfabética entre
  // eles (skill anatomy).
  #internals
  #label
  #variant

  // Getter antes do setter, com o default via `??=`.
  get internals() {
    return (this.#internals ??= this.attachInternals())
  }

  get label() {
    return (this.#label ??= '')
  }

  @attributeChanged('label')
  @repaint
  set label(value) {
    this.#label = value
  }

  get variant() {
    return (this.#variant ??= 'solid')
  }

  @attributeChanged('variant')
  @before(variantable)
  set variant(value) {
    this.#variant = value
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open', delegatesFocus: true })
  }

  // Método: verbo imperativo, camelCase, sem prefixo.
  @dispatchEvent('uploaded')
  upload() {
    return this.value
  }

  // Contrato de capacidade: sufixo -able, acionado por middleware.
  // Retorna `this` porque é comando (skill method).
  [variantable](variant) {
    this.internals.states.delete(this.variant)
    this.internals.states.add(variant)
    return this
  }
}

// Export default no fim, com o nome da classe.
export default Fileupload
