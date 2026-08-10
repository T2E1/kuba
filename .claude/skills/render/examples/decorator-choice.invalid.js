// ❌ `repaint` em tudo, e manipulação manual do DOM.
// Correto em: decorator-choice.valid.js

@paint(component, style)
class Badge extends Echo(HTMLElement) {
  #color
  #label

  // `color` só muda estilo, mas `repaint` reprocessa o template inteiro.
  // Consequências visíveis: o DOM é recriado, o foco dentro do componente
  // se perde e qualquer animação em curso reinicia — tudo para trocar uma
  // variável de cor.
  @attributeChanged
  @repaint
  set color(value) {
    this.#color = value
  }

  @attributeChanged
  @repaint
  set label(value) {
    this.#label = value

    // Manipulação manual fora do ciclo: agora existem duas fontes de
    // verdade para o conteúdo — esta linha e a função `component`. Elas
    // vão divergir (rule 021), e o próximo render desfaz esta alteração.
    this.shadowRoot.querySelector('span').textContent = value
  }
}

// E a função de estilo com literais, ignorando os tokens (rule 024):
const style = ({ color }) => `
  :host { background: ${color === 'danger' ? '#dc2626' : '#3b82f6'} }
`
