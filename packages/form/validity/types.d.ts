export default class Validity extends HTMLElement {
  readonly controller: AbortController
  readonly internals: ElementInternals
  state: string
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-validity': Validity
  }
}
