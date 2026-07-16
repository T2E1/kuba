export default class Stack extends HTMLElement {
  align: string
  direction: 'row' | 'column'
  readonly internals: ElementInternals
  justify: string
  spacing: string
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-stack': Stack
  }
}
