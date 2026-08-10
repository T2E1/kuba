// ❌ Mixins não achatados e tipos nomeados sem necessidade.
// Correto em: flattening.valid.ts

// Implementação:
//   @define('kb-highlight')
//   class Highlight extends Echo(Value(HTMLElement)) { … }

// Erro 1 — estender a declaração do mixin, esperando herdar a superfície.
// Não funciona: o código-fonte não é tipado, então não há nada de onde
// herdar. `value` e `on` simplesmente não existem para o consumidor.
export default class KUBAHighlightElement extends KUBAEchoElement {
  color: KUBAHighlightColorAttribute
}

// Erro 2 — tipo nomeado onde o primitivo já expressa tudo (rule 064).
// `color` aceita qualquer string; envolver isso num alias não restringe
// nada e só adiciona um nome para manter.
type KUBAHighlightColorAttribute = string

// Erro 3 — nome derivado do mixin, não do componente. "KUBAValueAttribute"
// descreve o mixin Value, não o Highlight, e quebra a taxonomia da Regra 3.
type KUBAValueAttribute = string | undefined

// Erro 4 — bloco `declare global` ausente: `document.querySelector('kb-highlight')`
// devolve Element genérico, e o consumidor perde o autocomplete inteiro.
