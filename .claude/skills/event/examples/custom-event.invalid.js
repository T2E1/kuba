// ❌ Listener no constructor, evento preso no Shadow DOM, acoplamento direto.
// Correto em: custom-event.valid.js

class Card extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    // O elemento ainda não está no documento — o listener nunca dispara.
    // E não há disconnectedCallback removendo: quando funcionar, vaza.
    this.addEventListener('click', this.handleClick)
  }

  handleClick(event) {
    // `composed` ausente (default false): o evento borbulha DENTRO do
    // Shadow DOM e para na fronteira. Nenhum listener externo recebe.
    // Esta é a causa nº 1 de "meu evento não chega".
    this.dispatchEvent(new CustomEvent('onClick', { bubbles: true }))

    // Acoplamento direto: o Card conhece a existência e a API do Toast.
    // Cria dependência que a rule 018 previne, e impede testar o Card
    // isolado — o Toast precisa existir.
    document.querySelector('kb-toast').show('Item selecionado')
  }
}

// Ainda: `onClick` é nome de handler, não de evento. Evento nomeia um fato
// consumado — `clicked` (rule 034).
