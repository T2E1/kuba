// ❌ Nomes fora do padrão de packages/.
// Correto em: element.valid.ts

import { variantable } from './interface.js' // singular: o padrão é plural

// Tag com hífen interno: quebra a derivação mecânica do nome da classe, que
// a skill `types` pressupõe para montar KUBA<PascalName>Element.
@define('kb-file-upload')
@paint(component, style)
// Classe não espelha o tag: FileUploadComponent contra kb-file-upload.
// O sufixo `Component` é redundante — tudo aqui é componente (rule 035).
class FileUploadComponent extends Echo(Hidden(HTMLElement)) {
  // Campo privado não espelha o acessor: #btnLbl para `buttonLabel`.
  // Duas abreviações num nome só (rule 006).
  #btnLbl

  // Underscore como convenção de privacidade: não é privacidade (rule 035).
  _internals

  // Getter sem default e nome divergente do campo.
  get buttonLabel() {
    return this.#btnLbl
  }

  set buttonLabel(value) {
    this.#btnLbl = value
  }

  // Método com nome de substantivo: método é verbo (rule 034).
  // E `proc` abrevia sem necessidade.
  proc() {
    return this.value
  }

  // Contrato de capacidade nomeado como ação: `setVariant` promete um
  // comando, mas isto é um hook de capacidade acionado por middleware —
  // deveria terminar em -able.
  [variantable](variant) {
    return this
  }
}

// Export inline, divergindo do padrão `export default <Nome>` no fim.
export default FileUploadComponent
