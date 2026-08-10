// ❌ Constructor fazendo o que não pode fazer.
// Correto em: sequence.valid.js

class Button extends HTMLElement {
  constructor() {
    // Erro de runtime: `this` não existe antes de super().
    this.attachShadow({ mode: 'open' })
    super()

    // Vem sempre null: o parser ainda não processou os atributos quando o
    // constructor roda. Este é o bug que a convenção existe para prevenir.
    this.color = this.getAttribute('color')

    // O elemento ainda não está no documento — o listener nunca dispara.
    this.addEventListener('click', this.handleClick)

    // Modificar DOM externo daqui é efeito colateral em elemento que talvez
    // nem seja inserido (rule 036).
    document.body.classList.add('has-button')

    // Constructor tem de ser síncrono. A Promise não tem onde ser tratada
    // (rule 028), e o elemento fica num estado indefinido enquanto resolve.
    fetch('/api/theme').then((theme) => this.applyTheme(theme))

    // `mode: 'closed'` impediria teste e inspeção sem trazer segurança real.
  }
}
