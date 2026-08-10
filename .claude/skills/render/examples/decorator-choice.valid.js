// ✅ O decorator escolhido pelo que a mudança realmente afeta.

// Funções puras: recebem o estado, devolvem markup ou estilo. Não tocam o
// DOM, não disparam efeito (rule 036) — por isso são testáveis isoladas.
const component = ({ label }) => `<span part="label">${label}</span>`

// Valores vêm de tokens (rule 024, skill token). A variante escolhe o token,
// nunca o hexadecimal.
const style = ({ color }) => `
  :host {
    background: var(--color-${color});
    padding: var(--spacing_inset-nano);
    border-radius: var(--border-radius-xs);
  }
`

@paint(component, style)
class Badge extends Echo(HTMLElement) {
  #color
  #label

  // Só a aparência muda → retouch. Recalcula apenas o CSS: o DOM permanece,
  // o foco permanece, as animações continuam.
  @attributeChanged
  @retouch
  set color(value) {
    this.#color = value
  }

  // O texto faz parte do template → repaint. Percorre
  // willPaint → html → css → didPaint.
  @attributeChanged
  @repaint
  set label(value) {
    this.#label = value
  }
}

// Duas garantias que o sistema dá de graça:
//
// - `setImmediate` agrupa as atualizações do mesmo tick: setar `color` e
//   `label` em sequência produz um render só, não dois.
// - O guard `isPainted` impede render antes da conexão — é por isso que
//   não se renderiza no constructor.
//
// Nenhuma linha manipula o DOM diretamente: a função `component` é a única
// fonte de verdade do markup.
