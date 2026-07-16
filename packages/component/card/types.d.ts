export default class Card extends HTMLElement {
  direction: 'row' | 'column'
  readonly internals: ElementInternals
  value: string
  click(): this
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-card': Card
  }
}
