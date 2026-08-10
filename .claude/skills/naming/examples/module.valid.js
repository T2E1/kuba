// ✅ O padrão de packages/mixin/, packages/event/ e dos arquivos do pacote.

// ─── mixin/width.ts ───────────────────────────────────────────────────────
// PascalCase: o mixin produz uma classe. Sem sufixo `Mixin` — a forma
// `(Super) => class` já anuncia o que é.
//
// O parâmetro é `Super`, e a classe interna é SEMPRE `C`: ela não tem
// identidade própria fora desta composição, e nomeá-la sugeriria que tem.
const Width = (Super) => {
  class C extends Super {
    #width

    get width() {
      return (this.#width ??= '100%')
    }

    @attributeChanged('width')
    set width(value) {
      this.#width = value
    }
  }

  return C
}

export default Width

// ─── event/prevent.js ─────────────────────────────────────────────────────
// Arquivo = função = export default. `prevent.js` → `prevent` → `prevent`.
// Quem lê `import { prevent } from '@event'` sabe exatamente onde procurar.
//
// Palavra única, descrevendo o efeito no ponto de uso:
//   @on.submit('form', prevent)
function prevent(event) {
  event.preventDefault()
  return event
}

export default prevent

// Multi-palavra só quando inevitável, em camelCase — e o arquivo acompanha:
//   attributeChanged.js → attributeChanged
//   customEvent.js      → customEvent
//   formData.js         → formData

// ─── component/card/component.js ──────────────────────────────────────────
// A função chama-se sempre `component`. O parâmetro é nomeado pelo elemento
// — não `self` —, então o arquivo se identifica sozinho quando aberto entre
// outros quinze iguais.
function component(card) {
  return html`
    <article ${card.alt ? `aria-label="${card.alt}"` : ''}>
      <slot></slot>
    </article>
  `
}

export default component

// ─── component/card/style.js ──────────────────────────────────────────────
// Mesma regra. Omitir o parâmetro quando não é usado.
function style(card) {
  return css`
    :host {
      width: ${card.width};
      padding: var(--spacing_inset-nano);
    }
  `
}

export default style
