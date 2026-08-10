// ❌ Mixin, utilitário e funções do pacote fora do padrão.
// Correto em: module.valid.js

// ─── mixin/widthMixin.js ──────────────────────────────────────────────────
// Sufixo `Mixin` redundante: a forma `(Super) => class` já diz o que é.
// E camelCase onde o padrão é PascalCase — mixin produz classe.
const widthMixin = (Base) => {
  // Classe interna nomeada: sugere que WidthImpl existe fora daqui e pode
  // ser referenciada. Ela é só o produto da composição.
  class WidthImpl extends Base {
    #w // abreviação de uma letra (rule 006)

    get width() {
      return this.#w
    }
  }

  return WidthImpl
}

// ─── event/preventDefaultHandler.js ───────────────────────────────────────
// Três divergências: nome do arquivo ≠ nome da função ≠ nome do export.
// Encontrar a origem de `pd` importado em outro arquivo vira caça.
function pd(event) {
  event.preventDefault()
  return event
}

export default pd

// ─── component/card/component.js ──────────────────────────────────────────
// Função renomeada: o import em card.ts espera `component`, e o nome
// divergente obriga a renomear no import — indireção sem ganho.
function renderCardTemplate(self) {
  return html`<div><slot></slot></div>`
}

// ─── component/card/style.js ──────────────────────────────────────────────
// `self` não diz que elemento é. Com quinze arquivos style.js abertos, o
// parâmetro deixa de identificar qual componente se está estilizando.
function style(self) {
  return css`:host { width: ${self.width} }`
}
