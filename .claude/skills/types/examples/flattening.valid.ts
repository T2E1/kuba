// ✅ Mixins achatados, taxonomia aplicada, primitivo preservado.

// Implementação em src/behavior/highlight/highlight.ts:
//
//   @define('kb-highlight')
//   class Highlight extends Echo(Value(HTMLElement)) {
//     get color() { return (this.#color ??= 'yellow') }
//     @attributeChanged('color') set color(v) { this.#color = v }
//     clear() { this.value = ''; return this }
//   }

// Regra 3 — nome escopado ao componente, nunca ao mixin. O sufixo `Sink`
// nomeia o conjunto fechado dentro da forma.
type KUBAHighlightOnAttributeSink = 'method' | 'attribute' | 'setter'

// Regra 4 — tipo nomeado justificado: a forma é um template literal, que o
// primitivo `string` não expressa.
type KUBAHighlightOnAttribute =
  `${string}/${string}:${KUBAHighlightOnAttributeSink}/${string}${'' | `|${string}`}`

export default class KUBAHighlightElement extends HTMLElement {
  // Próprio do Highlight. Regra 4: `string` sem restrição permanece
  // `string` — nenhum alias por simetria.
  color: string

  // Contribuído pelo mixin Value, achatado manualmente (Regra 2).
  value: string | undefined

  // Contribuído pelo mixin Echo, achatado manualmente.
  on: KUBAHighlightOnAttribute | (string & {})

  // Próprio do Highlight. `this` porque o método é comando encadeável
  // (skill method).
  clear(): this
}

// Sem isto, document.querySelector('kb-highlight') devolve Element genérico.
declare global {
  interface HTMLElementTagNameMap {
    'kb-highlight': KUBAHighlightElement
  }
}

// `Headless`, se estivesse na cadeia, não geraria declaração nenhuma: ele
// só oculta o elemento no connect e não contribui superfície pública.
// Ver references/achatamento-mixins.md para o catálogo por mixin.
