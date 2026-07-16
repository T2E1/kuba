export default class Inset extends HTMLElement {
  direction: 'row' | 'column'
  readonly internals: ElementInternals
  side: string
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-inset': Inset
  }
}
